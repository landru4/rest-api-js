'use strict'

const { Exception } = require('sass');
const { resolveSerializer } = require('../../Models/Client');

//const { jwt } = require('../../../config/auth');

const Client = use('App/Models/Client');
const Database = use('Database')
//const Got = use('got');

async function totalClientes() {
    //let count = await Client.query().where('is_active', '=', true).count()
    //let count = await Client.all().count()

    const count = await Database
                            .from('clients')
                            .count('* as total')           

    const total = count[0].total

    console.log('Cantidad de clientes: ', total);
    return total;
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
                if (error || response.statusCode !== 200) {
                    console.log('Error al obtener el cliente: ', id_cliente);
                    //sleep(3);
                    setTimeout( function() { resolve(result()) }, 500 );
                }
                else {
                    console.log('Conexion cliente exitosa: ', id_cliente);
                    return resolve(response.body);
                }
            });
        })
    });

    var fromapi = await result();
    try { 
        //if (isJSON(fromapi)) {
            let data = JSON.parse(fromapi)
            //console.log('Id Cliente: ', id_cliente,  ' - mail: ', data.email);
            //console.log(fromapi);

            await Client.findOrCreate(
                {
                    id: id_cliente
                }, 
                JSON.parse(fromapi)
                /*{
                    id: m[3],
                    email: m[3],
                    first_name: 'Pepe',
                    last_name: 'Prueba',
                    job: 'Job prueba',
                    country: 'Uruguay',
                    address: 'Direccionnnnnn',
                    zip_code: m[2],
                    phone: 43627585
                }*/
            );
        //}
        console.log('Cliente guardado con exito: ', id_cliente);
    } catch (e) {
        console.log('Error de API al obtener datos de cliente: ', id_cliente);
    }
};


async function ProcesarLinea1(linea) {
    console.log("Proceso la linea 1");
    var regex = /(1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Cabecera:");
        console.log("Tipo:", m[1]);
        console.log("Id Pago:", m[2]);
        console.log("Moneda:", m[3]);
        console.log("Monto total:", m[4]);
        console.log("Total descuento:", m[5]);
        console.log("Total c/descuento:", m[6]);

        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Linea 1 OK!";
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
    console.log("Proceso la linea 4");
    var regex = /(4)\s{15}(\d{8})(\w{32})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);

    for (const m of matches) {
        console.log('Tipo reg:', m[1]);
        console.log('Fecha pago:', m[2]);
        console.log('Id Cliente:', m[3]);
        // index of where the match starts
        const cursorPos = m.index;
        /*sleep(3).then(function()
        {*/
        await ObtenerDatosClienteAPI(m[3],index);
        /*});*/
    }

    return "Proceso Linea 4 OK!";
};

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
        await Database.truncate('clients').then(function(resu){
            if (resu) {
                response.ok('OK borrar todos los clientes')
            }
            else {
                response.send('Ocurrió un error, no se pueden borrar los clientes')
            } 
        })

        return 'Clientes borrados con exito!!!'
    }

    async file({ req, auth, response }) {
        var res = '';

        try {
            await auth.check()
            console.log('Autenticacion OK')
            res = res + "Autenticacion OK"

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

            /*
            const result = new Promise((resolve, reject) => {
                request(options, function(error, response) {
                if (error) {
                    console.log('Error: ', error);
                    return reject(error);
                }
                //console.log(JSON.parse(response.body));
                console.log(response.body);
                //return resolve(JSON.parse(response.body));
                return resolve(response.body);
                });
            })*/

            /*
            let retry = (async function() {
            let count = 0;
            
            return function(max, timeout, next) {
                request(options, function (error, response) {
                if (error || response.statusCode !== 200) {
                    console.log('fail');
            
                    if (count++ < max) {
                        return setTimeout(function() {
                            retry(max, timeout, next);
                        }, timeout);
                    } else {
                        return next(new Error('max retries reached'));
                    }
                }
            
                console.log('success');
                //next(null, response.body);
                return response.body;
                });
            }
            })();
              
            var s = await retry(20, 1000, function(err) {
                //do(something);
            });

            */

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

            //var fromapi = await result;

            // Guardar el archivo
            /*
            var fs = require('fs');
                fs.writeFile('file.txt', fromapi, function (err) {
                if (err) return console.log(err);
                console.log('Archivo leido > file.txt');
            });*/

            //var r = /((1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13}))\n(((2)(\w{32})(\d{13})\s{5}(\d{1})\n)*)(((3)(\w{32})(\d{13})\s{3}(\d{1}))\n)*(((4)\s{15}(\d{8})(\w{32}))\n)/g,
            var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g,
            s = await result(),
            m;

            //console.log('Valor de s: ', s)

            const matches = s.matchAll(r);
            var cantidad = 0;
            var promise1 = new Promise(function(resolve, reject) {
                //resolve( ()=> { 
                for (const m of matches) {
                    cantidad++

                    if (cantidad > 5) {
                        console.log('HAY MAS DE 5 CLIENTES:', cantidad);
                        return resolve();
                    }

                    sleep(2).then(function() {
                        const fullMatch = m[0]; 
                        //console.log("\n\rm1:", m[1]); // Linea 1
                        //console.log("m2:\n\r", m[2]); // Todas las lineas tipo 2
                        ////console.log("m3:", m[3]); // Ultimo Tipo 2
                        //console.log("m4:\n\r", m[4]); // Todas las lineas tipo 3
                        ////console.log("m5:", m[5]); // Ultimo Tipo 3
                        //console.log("m6:", m[6]); // Linea Tipo 4
                        
                        res = res + '\n\n' + m[1] + "\n";
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
                            resolve(ProcesarLinea4(m[6],cantidad));
                        });
                            
                        promise2.
                            then(function () {
                                //console.log('Proceso linea 4 ok:', m[6]);
                            }).
                            catch(function () {
                                console.log('Error al procesar linea 4: ', e);
                            });
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
                    });
                }
                return resolve();
                 //})
            });
            
            promise1.
            then(function () {
                sleep(10).then(function() {
                    var cantTotal = totalClientes();
                    response.ok('TODO EXCELENTE!!!!', cantTotal) 
                    console.log('Arhivo procesado exitosamente!')
                });
            }).
            catch(function (e) {
                console.log('Error al procesar linea 4: ', e);
            });
            /*.finally(function() { 

            });*/
        }
        catch (error) {
            response.ok('Hubo errores: ', error)
            console.log('Error: ', error)
            return 'Error: ', error
        }
        return res;
    }
}





module.exports = ClientController
