'use strict'

//const { Exception } = require('sass');
//const { resolveSerializer } = require('../../Models/Client');

//const { jwt } = require('../../../config/auth');

const Client = use('App/Models/Client');
const Pago = use('App/Models/Pago');
const Database = use('Database')
//const Got = use('got');

async function totalPago() {
    const monto = await Database
                            .from('pagos')
                            .sum('monto_total as total')
    const total = monto[0].total
    console.log('Monto total pagos: ', total/100);
    return total;
}

async function totalClientes() {
    const count = await Database
                            .from('clients')
                            .count('* as total')
    const total = count[0].total
    console.log('Cantidad de clientes: ', total);
    return total;
}

async function guardarPago(id_pago, pago) {
    //console.log('Pago a guardar: ', pago);
    try { 
        await Pago.findOrCreate( 
            {
                id: id_pago
            }, 
            { ...pago }
            /*
            {
                id: id_pago,
                moneda: pago.moneda,
                monto_total: pago.monto_total,
                total_descuento: pago.total_descuento,
                total_con_descuento: pago.total_con_descuento,
                fecha_pago: pago.fecha_pago, //'2022-01-04',
                id_cliente: pago.id_cliente //'d78d62b3e47e4f96ad61cf67db9a6110'
            }*/
            /*...pago*/
        );
        console.log('Pago creado/encontrado con exito: ', id_pago);
    } catch (e) {
        console.log('Error al crear pago: ', id_pago);
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

async function ObtenerDatosClienteAPI (id_cliente, index) {
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

    const result = (async () => {
        //console.log('Prometo obtener el cliente: ', id_cliente, '(indice: ', index , ')');
        return new Promise((resolve, reject) => {
            request(options, function(error, response) {
                if (error || response.statusCode !== 200 || response.body===null) {
                    console.log('API: Error al obtener el cliente: ', id_cliente);
                    if (error)
                        console.log('Error: ', error);
                    //sleep(3);
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


async function ProcesarLinea1y4(linea1, linea4, index) {
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
        //console.log('Datos pago linea 1: ', jsonResult)
        // index of where the match starts
        const cursorPos = m.index;
    }
    var jLinea4 = await ProcesarLinea4(linea4, index);
    //console.log('Datos pago linea 4: ', jLinea4)
    return  { ...jsonLinea1, ...jLinea4 };
};

async function ProcesarLinea2(linea) {
    console.log("Proceso la linea 2");
    var regex = /(2)(\w{32})(\d{13})\s{5}(\d{1})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Transaccion:");
        console.log("Tipo reg:", m[1]);
        console.log("Id Trans:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);
        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Lineas 2 OK!";
};

// Estas funciones estan independientes para poder tener mejor mantenimiento ante posibles cambios en la estructura
async function ProcesarLinea3(linea) {
    console.log("Proceso la linea 3");
    var regex = /(3)(\w{32})(\d{13})\s{3}(\d{1})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Tipo reg:", m[1]);
        console.log("Id Desc:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);
        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Lineas 3 OK!";
};

const sleep = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, (seconds * 1000));
    });
};

async function ProcesarLinea4(linea, index) {
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
        const cursorPos = m.index;
        /*sleep(3).then(function()
        {*/
        jsonResult = 
        {
            fecha_pago: m[2],
            id_cliente: m[3]
        }
        await guardarClienteDummy(m[3])

        //console.log('Datos pago linea 4: ', jsonResult)
        await ObtenerDatosClienteAPI(m[3],index); // TODO: ver donde va para obtener los datos del cliente
        /*});*/
    }
    return jsonResult; // Retorna fecha de pago y el id del cliente
};

async function probandoSincronico() {
    //console.log('BBBBBBBBBBBBBBBBB!')
    /*var cantTotal = */
    await totalClientes();
    //return 'Arhivo procesado exitosamente! Cant clientes en bd actualmente:' + cantTotal;
}


async function Proceso(regText) {
    var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g
    var cantidad = 0;
    //resolve( ()=> {
    const matches = regText.matchAll(r);
    for (const m of matches) {
    //while (cantidad < 5 /* cantidad <= cantidadMatches*/) {
        cantidad++
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
            //// index of where the match starts
            const cursorPos = m.index;

            /*
            ProcesarLinea1(m[1]);
            ProcesarLinea2(m[2]);
            ProcesarLinea3(m[4]);
            ProcesarLinea4(m[6]);*/
            
            //Promise.all([ProcesarLinea1(m[1]), ProcesarLinea2(m[2]), ProcesarLinea3(m[4]), ProcesarLinea4(m[6])])
            //Promise.all([ProcesarLinea1(m[1]), ProcesarLinea2(m[2]), ProcesarLinea3(m[4])])
            
            //const pru = Promise.all([ProcesarLinea1(m[1]), ProcesarLinea4(m[6],cantidad)])

            var promise2 = new Promise(function(resolve, reject) {
                resolve(ProcesarLinea1y4(m[1],m[6],cantidad))
            });
                
            promise2.
                then(function (resolve) {
                    //console.log('Datos pago resolve: ', resolve)
                    //var res1 = await 
                    guardarPago(resolve.id, resolve)
                }).
                catch(function (e) {
                    console.log('Error al procesar linea 4: ', e);
                });

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

    //resolve('Fin del for');
     //})
     return 'Fin proceso'
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
        message += await Database.truncate('pagos').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los pagos')
                return 'OK borrar todos los pagos'
                //response.ok('OK borrar todos los pagos')
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los pagos')
                return 'Ocurrió un error, no se pueden borrar los pagos'
                //response.error('Ocurrió un error, no se pueden borrar los pagos')
            }
        })

        message += '\n' + await Database.truncate('clients').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los clientes')
                return 'OK borrar todos los clientes'
                //response.ok('OK borrar todos los clientes')
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los clientes')
                return 'Ocurrió un error, no se pueden borrar los clientes'
                //response.error('Ocurrió un error, no se pueden borrar los clientes')
            } 
        })

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
            return 'Missing or invalid api token'
          }

        //if (!req.headers.Authorization) {
            //return res.status(403).send({ message: 'No tienes autorizacion'})
            //return 'No tienes autorizacion'
        //}
        //console.log(request.all)

        //const token = request.header.Authorization//.split(' ')[1]
        //const token = auth
        
        //console.log(token)

        //const exito = await auth.attempt(token);

        //console.log("Token enviado: ", token)

        
        //decodeToken (token)
        //    .then(console.log("Login exitoso!"))
            /*.then(response => {
                message: 'Login exitoso'
            })*/
       //     .catch(response => {
       //         res.status(response.status)
       //     })
       
        
        
        /*const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;*/
        //const request = require('request');

        /*
        {
            "email": "test6landru@gmail.com",
            "password": "123456"
        }
        token: "e16a461988f343f34dc81c0042318230rJT7wM//3vK2XA/f0IrM2+jNyOQ6oxwIWmJqwBTRJlYDLknuKnLI2orzuMfn5rtz"
        */
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
                    request(options, function(error, response) {
                        if (error || response.statusCode !== 200) {
                            console.log('Error al obtener el archivo');
                            //response.send('Error al obtener el archivo: ', error)
                            setTimeout( function() { resolve(result()) }, 5000 );
                        }
                        else {
                            //console.log('Conexion exitosa');
                            return resolve(response.body);
                        }
                    });
                })
            });

            
            var s = await result();

            //var promise1 = new Promise();

            var promise1 = new Promise(function(resolve, reject) {
                resolve(Proceso(s))
            });

            //await probandoSincronico();
            //setTimeout( function() { var mens = probandoSincronico() }, 5000 );

            promise1
            .then(function (resolve) {
                if (resolve) {
                    res += '\n' + resolve + '\n'
                    setTimeout( function() { probandoSincronico() }, 5000 );
                    //var mens = probandoSincronico();
                    //console.log(mens)
                    //console.log('Fin de procesar clientes y pagos!\n')
                    //var ttt = await probandoSincronico();
    /*
                    var promise3 = new Promise(function(resolve, reject) {
                        resolve (probandoSincronico());
                    });
                        
                    promise3.
                        then(function (resolve) {
                            res += resolve + '\n'
                            console.log(resolve);
                            //response.ok(resolve)
                        }).
                        catch(function () {
                            console.log('Error al procesar promesa 3: ', e);
                        });*/

                    //response.ok(resolve)
                    //sleep(10).then(function() {
                        /*var cantTotal = totalClientes();
                        console.log('Arhivo procesado exitosamente!')
                        response.ok('TODO EXCELENTE!!!!', cantTotal)*/
                    //});
                }
            })
            //.then()
            .catch(function (e) {
                console.log('Error al procesar archivo: ', e);
            });

            
            /*.finally(function() { 

            });*/
        }
        catch (error) {
            //res += resolve + '\n'
            response.ok('Hubo errores: ', error)
            console.log('Error: ', error)
            return 'Error: ', error
        }
        return res;
    }
}





module.exports = ClientController
