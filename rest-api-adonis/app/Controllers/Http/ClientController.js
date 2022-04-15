'use strict'

//const Transaccion = require('../../Models/Transaccion');

//const { Exception } = require('sass');
//const { resolveSerializer } = require('../../Models/Client');
//const { resolveSerializer } = require('../../Models/Pago');
//const { resolveSerializer } = require('../../Models/Pago');

//const { jwt } = require('../../../config/auth');

const Client = use('App/Models/Client');
const Pago = use('App/Models/Pago');
const Transaccion = use('App/Models/Transaccion');
const Descuento = use('App/Models/Descuento');
const Database = use('Database')

const PagoController = use('App/Controllers/Http/PagoController');
const TransaccionController = use('App/Controllers/Http/TransaccionController');

async function totalClientes() {
    const count = await Database
                            .from('clients')
                            .count('* as total')
    const total = count[0].total
    console.log('Cantidad de clientes: ', total);
    return total;
}

async function guardarDescuento(descuento) {
    //console.log('Descuento a guardar: ', descuento);
    try { 
        await Descuento.findOrCreate( 
            {
                id: descuento.id
            }, 
            { ...descuento }
        );
        //console.log('Descuento creado/encontrado con exito: ', id_descuento);
    } catch (e) {
        console.log('Error al crear Descuento: ', descuento.id);
        console.log('DB Error: ', e);
    }
}

async function guardarClienteDummy(id_cliente) {
    try { 
        await Client.findOrCreate( 
            {
                id: id_cliente
            }, 
            {
                id: id_cliente,
                email: id_cliente,
                first_name: 'testName',
                last_name: 'testLastname',
                job: 'testJob',
                country: 'testCountry',
                address: 'testDireccion',
                zip_code: 'testzip',
                phone: 'testphone'
            }
        );
        console.log('Cliente creado/encontrado con exito: ', id_cliente);
    } catch (e) {
        console.log('Error al crear cliente: ', id_cliente);
        console.log('DB Error: ', e);
    }
}

async function ObtenerDatosClienteAPI (id_cliente) {
    // Crear la llamada a la API para obtener los datos del cliente.
    var request = require('request');

    var options = {
        'method': 'GET',
        'url': 'https://increase-transactions.herokuapp.com/clients/' + id_cliente,
        'headers': {
            'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm',
            'Content-Type': 'application/json'
        }
    };

    var cantVecesIntentoObtenerCliente = 0
    const result = (async () => {
        cantVecesIntentoObtenerCliente++;
        //console.log('Prometo obtener el cliente: ', id_cliente, '(indice: ', index , ')');
        return new Promise((resolve, reject) => {
            request(options, function(error, response) {
                if (error || response.statusCode !== 200 || response.body===null) {
                    console.log('API: Error al obtener el cliente: ', id_cliente, 'Intento: ', cantVecesIntentoObtenerCliente);
                    if (error)
                        console.log('Error: ', error);
                    setTimeout( function() { resolve(result()) }, 500 );
                }
                else {
                    console.log('API: Datos cliente con exito: ', id_cliente);
                    return resolve(response.body);
                }
            });
        })
    });

    var fromapi = await result();
    try { 
        //if (isJSON(fromapi)) {
            //let data = JSON.parse(fromapi)
            //console.log('Id Cliente: ', id_cliente,  ' - mail: ', data.email);
            //let x = { updated_at : Date.now() }
            //fromapi +=  JSON.parse(fromapi) 
            var jsonA = {...JSON.parse(fromapi) ,...{ updated_at : Date.now() }}

            //var jsonString = fromapi

            //console.log('String:', jsonA);

            const affectedRows = await Database
            .table('clients')
            .where('id', id_cliente)
            .update(jsonA)
            /*
            const client = await Client.find(id_cliente)
            await client
            .update( JSON.parse(fromapi) )*/
        //}
        if (affectedRows > 0)
            console.log('Cliente actualizado con exito: ', id_cliente);
        else console.log('Cliente sin cambios: ', id_cliente);
    } catch (e) {
        console.log('API: Error al obtener datos de cliente: ', id_cliente);
        console.log('API: Error: ', e);
    }
};

async function extraerDatosPago(linea1, jLinea4) {
    //console.log("Proceso la linea 1");
    var regex = /(1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13})/g;
    const matches = linea1.matchAll(regex);
    //console.log(linea);
    var jsonLinea1
    for (const m of matches) {
        /*console.log("Cabecera:");
        console.log("Tipo:", m[1]);
        console.log("Id Pago:", m[2]);
        console.log("Moneda:", m[3]);
        console.log("Monto total:", m[4]);
        console.log("Total descuento:", m[5]);
        console.log("Total c/descuento:", m[6]);*/
        jsonLinea1 = 
        {
            id: m[2], // Es el id de pago
            moneda: m[3],
            monto_total: m[4],
            total_descuento: m[5],
            total_con_descuento: m[6]
        }
    }
    
    //console.log('Datos pago linea 4: ', jLinea4)
    return  { ...jsonLinea1, ...jLinea4 };
};

async function procesarTransacciones(linea, id_cliente, id_pago) {
    //console.log("Proceso la linea 2");
    var regex = /(2)(\w{32})(\d{13})\s{5}(\d{1})/g;
    const matches = linea.matchAll(regex);
    //console.log(linea);
    var jsonResult
    for (const m of matches) {
        /*console.log("Transaccion:");
        console.log("Tipo reg:", m[1]);
        console.log("Id Trans:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);*/
        jsonResult = 
        {
            id: m[2],
            monto_total: m[3],
            tipo: m[4],
            id_cliente: id_cliente,
            id_pago: id_pago
        }
        const tc = new TransaccionController()
        tc.guardarTransaccion(jsonResult)
    }
    //return "Proceso Lineas 2 OK!";
};

// Estas funciones estan independientes para poder tener mejor mantenimiento ante posibles cambios en la estructura
async function procesarDescuentos(linea, id_pago) {
    //console.log("Proceso la linea 3");
    var regex = /(3)(\w{32})(\d{13})\s{3}(\d{1})/g;
    const matches = linea.matchAll(regex);
    //console.log(linea);
    var jsonResult
    for (const m of matches) {
        /*console.log("Tipo reg:", m[1]);
        console.log("Id Desc:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);*/
        jsonResult = 
        {
            id: m[2],
            monto: m[3],
            tipo: m[4],
            id_pago: id_pago
        }
        guardarDescuento(jsonResult)
    }
    //return "Proceso Lineas 3 OK!";
};

async function ProcesarLinea4(linea) {
    //console.log("Proceso la linea 4");
    var regex = /(4)\s{15}(\d{8})(\w{32})/g;
    const matches = linea.matchAll(regex);
    //console.log(linea);
    var jsonResult
    for (const m of matches) {
        /*console.log('Tipo reg:', m[1]);
        console.log('Fecha pago:', m[2]);
        console.log('Id Cliente:', m[3]);*/
        // index of where the match starts
        jsonResult = 
        {
            fecha_pago: m[2],
            id_cliente: m[3]
        }
        await guardarClienteDummy(m[3]);
    }
    return jsonResult; // Retorna fecha de pago y el id del cliente
};

async function Proceso(regText) {
    var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g
    var cantidad = 0;
    //resolve( ()=> {
    const matches = regText.matchAll(r);
    for (const m of matches) {
    //while (cantidad < 5 /* cantidad <= cantidadMatches*/) {
        cantidad++;
        //const m = matches[cantidad]
        
        if (cantidad > 5) {
            console.log('HAY MAS DE 5 CLIENTES:', cantidad);
            break
            //return resolve('HAY MAS DE 5 CLIENTES:' + cantidad);
        }

        //sleep(2).then(function() {
            //const fullMatch = m[0];
            //console.log("\n\rm1:", m[1]); // Linea 1
            //console.log("m2:\n\r", m[2]); // Todas las lineas tipo 2
            ////console.log("m3:", m[3]); // Ultimo Tipo 2
            //console.log("m4:\n\r", m[4]); // Todas las lineas tipo 3
            ////console.log("m5:", m[5]); // Ultimo Tipo 3
            //console.log("m6:", m[6]); // Linea Tipo 4
            
            //res = res + '\n\n' + m[1] + "\n";

            /*
            ProcesarLinea1(m[1]);
            procesarTransacciones(m[2]);
            procesarDescuentos(m[4]);
            ProcesarLinea4(m[6]);*/
            
            //Promise.all([ProcesarLinea1(m[1]), procesarTransacciones(m[2]), procesarDescuentos(m[4]), ProcesarLinea4(m[6])])
            //Promise.all([ProcesarLinea1(m[1]), procesarTransacciones(m[2]), procesarDescuentos(m[4])])
            
            //const pru = Promise.all([ProcesarLinea1(m[1]), ProcesarLinea4(m[6],cantidad)])
            var jLinea4 = await ProcesarLinea4(m[6]);
            var pago = await extraerDatosPago(m[1],jLinea4,cantidad)            
            const pagoC = new PagoController()
            await pagoC.guardarPago(pago)
            await Promise.all([procesarTransacciones(m[2], pago.id_cliente, pago.id), procesarDescuentos(m[4], pago.id),ObtenerDatosClienteAPI(jLinea4.id_cliente)])

            /*
            var promise2 = new Promise(function(resolve, reject) {
                resolve(extraerDatosPago(m[1],m[6],cantidad))
            });
                
            promise2.
                then(function (resolve) {
                    //console.log('Datos pago resolve: ', resolve)
                    //var res1 = await 
                    var id_pago = resolve.id
                    var pago = resolve
                    var promise3 = new Promise(function(resolve, reject) {
                        const pagoC = new PagoController()
                        pagoC.guardarPago(id_pago, pago)
                    });
                    promise3.
                    then(function (resolve) {
                        resolve(Promise.all([procesarTransacciones(m[2], resolve.id_cliente, id_pago), procesarDescuentos(m[4], id_pago)]))
                    }).
                    catch(function (e) {
                        console.log('Error al guardar pago: ', e);
                    });

                }).
                catch(function (e) {
                    console.log('Error al procesar linea 4: ', e);
                });
                */

            /*
            var promise2 = new Promise(function(resolve, reject) {

                var datosPago = ProcesarLinea1(m[1])
                resolve(ProcesarLinea4(m[6],cantidad));
            });
                
            promise2.
                then(function () {

                    //console.log('Proceso linea 4 ok:', m[6]);
                }).
                catch(function () {
                    console.log('Error al procesar linea 4: ', e);
                });
            */


            /*
            const linea4 = (async () => {
                console.log('Datos cliente');
                return new Promise((resolve, reject) => {
                    ProcesarLinea4(m[6],cantidad, function(error, response) {
                        if (error) {
                            console.log('Error al procesar linea 4: ', e);
                            //response.send('Error al obtener el archivo: ', error)
                            //setTimeout( function() { resolve(result()) }, 5000 );
                        }
                        else {
                            console.log('Conexion exitosa');
                            return resolve(response.body);
                        }
                    });
                });

            })*/
            ////Promise.all([ProcesarLinea1(m[1])])
            ////.then(resultArray => console.log(resultArray))
            //.then(
            /*() => { 
                    console.log('Arhivo procesado exitosamente!'),
                    Prueba(response)
                }*/
                //)
            //.catch(e => { console.log('Error de formato al procesar el archivo: ', e)} );
            //var aaa = await linea4;
        //});
    }



    /*
    const result1 = (async () => {
        console.log('Esperando... ');

        return new Promise((resolve, reject) => {
            probandoSincronico(function(error, response) {
                if (error || response.statusCode !== 200) {
                    console.log('Error archivo');
                    //response.send('Error al obtener el archivo: ', error)
                }
                else {
                    //console.log('Conexion exitosa');
                    return resolve(response.body);
                }
            });
        })
    });*/

    
    //console.log('Fin del for');
    //resolve('Fin del for');
    //})
    //return 'Fin proceso'
}

class ClientController {
    async store() {
        return {
            mensaje: 'Creamos un cliente desde el Controlador' 
        };
    };

    async index({ response }) {
        const clients = await Client.all()

        return response.ok(clients)
    }

    async borrarTodo({ response }) {
        //await Client.down().then(function(resu){

        var message = ''
        message += await Database.truncate('transaccions').then(function(resu){
            if (resu) {
                console.log('OK borrar todas las trans')
                return 'OK borrar todas las trans'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar las trans')
                return 'Ocurrió un error, no se pueden borrar las trans'
                //response.error('Ocurrió un error, no se pueden borrar las trans')
            }
        }) + '\n'

        message += await Database.truncate('descuentos').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los descuentos')
                return 'OK borrar todos los descuentos'
                //response.ok('OK borrar todos los descuentos')
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los descuentos')
                return 'Ocurrió un error, no se pueden borrar los descuentos'
                //response.error('Ocurrió un error, no se pueden borrar los descuentos')
            }
        }) + '\n'

        message += await Database.truncate('pagos').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los pagos')
                return 'OK borrar todos los pagos\n'
                //response.ok('OK borrar todos los pagos')
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los pagos')
                return 'Ocurrió un error, no se pueden borrar los pagos\n'
                //response.error('Ocurrió un error, no se pueden borrar los pagos')
            }
        }) + '\n'

        message += '\n' + await Database.truncate('clients').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los clientes')
                return 'OK borrar todos los clientes\n'
                //response.ok('OK borrar todos los clientes')
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los clientes')
                return 'Ocurrió un error, no se pueden borrar los clientes\n'
                //response.error('Ocurrió un error, no se pueden borrar los clientes')
            } 
        }) + '\n'

        response.ok(message)
        //return 'Tablas de datos borrados con exito!!!'
    }

    async file({ req, auth, response }) {
        var res = '';

        try {
            await auth.check()
                console.log('Autenticacion OK')
                res += 'Autenticacion OK\n'
        } catch (error) {
            console.log('Missing or invalid api token')
            //response.status(403).send('No tienes autorizacion')
            return 'Token invalido o ausente'
        }

        try {

            var request = require('request');

            var options = {
            'method': 'GET',
            'url': 'https://increase-transactions.herokuapp.com/file.txt',
            'headers': {
                'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm',
                'Content-Type': 'application/json'
                }
            };

            var cantIntentos = 0
            const result = (async () => {
                cantIntentos++
                console.log('Obteniendo archivo...intento ', cantIntentos);

                return new Promise((resolve, reject) => {
                    request(options, function(error, res) {
                        if (error || res.statusCode !== 200) {
                            console.log('Error al obtener el archivo');
                            setTimeout( function() { resolve(result()) }, 5000 );
                        }
                        else {
                            //console.log('Conexion exitosa');
                            return resolve(res.body);
                        }
                    });
                })
            });

            
            var s = await result();
            await Proceso(s)
            


            
            const pagos = await Pago.all()
            var jsonString = JSON.stringify(pagos.toJSON());
            res += 'Imprime JSON: \n' + jsonString
            console.log('Imprime JSON: ');
            console.log(pagos.toJSON());

            var cantClientes = await totalClientes()

            res += '\nCantidad de clientes: ' + cantClientes
            //console.log(postsJSON);

            /*
            var promise1 = new Promise(function(resolve, reject) {
                resolve()
            });

            promise1
            .then(function (resolve) {
                if (resolve) {
                    res += '\n' + resolve + '\n'
                    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                    setTimeout( function() { probandoSincronico() }, 5000 );
                }
            })
            .then(function (resolve) {
                if (resolve) {
                    const pagos = Pago.all()
                    const postsJSON = pagos.map((pago) => pago.serialize())
                    console.log('Imprime JSON: ');
                    console.log(postsJSON);
                }
            }
            )
            .catch(function (e) {
                console.log('Error al procesar archivo: ', e);
            });
            */
        }
        catch (error) {
            //response.error('Hubo errores: ', error)
            console.log('Error: ', error)
            return 'Error: ', error
        }
        return res;
    }
}





module.exports = ClientController
