'use strict'



//const Transaccion = require('../../Models/Transaccion');
//const { Exception } = require('sass');
//const { resolveSerializer } = require('../../Models/Client');
//const { resolveSerializer } = require('../../Models/Pago');
//const { resolveSerializer } = require('../../Models/Pago');
//const { jwt } = require('../../../config/auth');

const Client = use('App/Models/Client');
const Pago = use('App/Models/Pago');
//const Transaccion = use('App/Models/Transaccion');
//const Descuento = use('App/Models/Descuento');
const Database = use('Database')

//const PagoController = use('App/Controllers/Http/PagoController');
//const TransaccionController = use('App/Controllers/Http/TransaccionController');
const PagoController = use('./PagoController');
const TransaccionController = use('./TransaccionController');
const DescuentoController = use('./DescuentoController');

const esperaReintentarObtenerCliente = 500
global.salir = false

async function totalClientes() {
    const count = await Database
                            .from('clients')
                            .count('* as total')
    const total = count[0].total
    console.log('Cantidad de clientes: ', total);
    return total;
}

async function totalPagos() {
    const count = await Database
                            .from('pagos')
                            .count('* as total')
    const total = count[0].total
    console.log('Cantidad de pagos: ', total);
    return total;
}

async function totalTransacciones() {
    const count = await Database
                            .from('transaccions')
                            .count('* as total')
    const total = count[0].total
    console.log('Cantidad de transacciones: ', total, '\n');
    return total;
}

async function guardarClienteDummy(id_cliente) {
    try { 
        await Client.findOrCreate( 
            { id: id_cliente }, 
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
        //console.log('Cliente creado/encontrado con exito: ', id_cliente);
    } catch (e) {
        console.log('Error al crear cliente: ', id_cliente);
        console.log(e);
    }
}

async function extraerDatosLinea4(linea) {
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

async function obtenerDatosClienteAPI(id_cliente) {
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
                        console.log(error);
                    setTimeout( function() { resolve(result()) }, esperaReintentarObtenerCliente );
                }
                else {
                    if (cantVecesIntentoObtenerCliente > 1)
                    console.log('API: Datos cliente con exito: ', id_cliente);
                    return resolve(response.body);
                }
            });
        })
    });

    return await result();
}

async function obtenerClienteAPI(id_cliente) {
    var fromapi = await obtenerDatosClienteAPI(id_cliente)
    try { 
        var jsonCliente = {...JSON.parse(fromapi) ,...{ updated_at : Date.now() }}
        const affectedRows = await Database
        .table('clients')
        .where('id', id_cliente)
        .update(jsonCliente)
        if (affectedRows==0)
             console.log('Cliente sin cambios: ', id_cliente);
    } catch (e) {
        console.log('API: Error al obtener datos de cliente: ', id_cliente);
        console.log(e);
    }
};

async function procesoDataArchivo(regText) {
    console.log('Procesando datos del archivo (clientes, pagos, transacciones, descuentos)')
    const pagoC = new PagoController()
    const transC = new TransaccionController()
    const descC = new DescuentoController()
    var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g
    var cantidad = 0;
    const matches = regText.matchAll(r);
    for (const m of matches) {
        cantidad++;
        if (cantidad > 5) {
            console.log('HAY MAS DE 5 CLIENTES:', cantidad) // TODO: borrar esto al final
            break
        }
        var jLinea4 = await extraerDatosLinea4(m[6]);
        var pago = { ...await pagoC.extraerDatosPago(m[1]), ...jLinea4 }

        await pagoC.guardarPago(pago)
        await Promise.all([transC.procesarTransacciones(m[2], pago.id_cliente, pago.id), descC.procesarDescuentos(m[4], pago.id)/*, obtenerClienteAPI(jLinea4.id_cliente)*/])
    }
    console.log('Se guardaron ', cantidad, ' pagos y clientes obtenidos del archivo')
    console.log('Se ha procesado el archivo exitosamente')
}

async function intentoObtenerArhivo () {
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
                    console.log('Archivo obtenido exitosamente');
                    return resolve(res.body);
                }
            });
        })
    });

    return await result();
}

async function procesoGeneral() {
    var res = '';
    try {
        await procesoDataArchivo(await intentoObtenerArhivo())
        
        //const pagos = await Pago.all()
        //var jsonString = JSON.stringify(pagos.toJSON());
        //res += 'Imprime JSON: \n' + jsonString
        //console.log('Imprime JSON: ');
        //console.log(pagos.toJSON());

        res += '\nCantidad de Clientes: ' + await totalClientes()
        res += '\nCantidad de Pagos: ' + await totalPagos()
        res += '\nCantidad de Transacciones: ' + await totalTransacciones() + '\n'
    }
    catch (error) {
        console.log(error)
        return error
    }
    return res;
}

async function loopProcesoArchivos () {
    var cantIntentos = 0
    var res = '';

    const result = (async () => {
        cantIntentos++
        return new Promise((resolve, reject) => {
            res += '\nIniciando proceso automatico...intento ' + cantIntentos
            console.log('Iniciando proceso automatico...intento ', cantIntentos);
            procesoGeneral()
            if (salir) {
                console.log('Se terminará el proceso de actualizacion\n')
                resolve(res)
            }
            else {
                setTimeout( function() { resolve(result()) }, 8000 );
            }
        })
    });
    res += await result();
    console.log('Finalizara la actualizacion de los datos desde la API\n');
    return res
}

class ClientController {
    async store() {
        return {
            mensaje: 'Creamos un cliente desde el Controlador' 
        };
    };

    async clientes({ response }) {
        const clients = await Client.all()
        return response.ok(clients)
    }

    async borrarTodo({ response }) {
        //await Client.down().then(function(resu){
        const tc = new TransaccionController()

        var message =  await tc.borrarTodo() + '\n'

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

    async iniProceso({ req, auth, response }) {
        var res = '';
        try {
            await auth.check()
                console.log('Autenticacion OK')
                res += 'Autenticacion OK\n'
        } catch (error) {
            console.log('Token invalido o ausente')
            //response.status(403).send('No tienes autorizacion')
            return 'Token invalido o ausente'
        }
        res += await loopProcesoArchivos()
        return res
    }

    async finProceso({ req, auth, response }) {
        var res = '';
        try {
            await auth.check()
                console.log('Autenticacion OK')
                res += 'Autenticacion OK\n'
        } catch (error) {
            console.log('Token invalido o ausente')
            //response.status(403).send('No tienes autorizacion')
            return 'Token invalido o ausente'
        }
        salir = true
        //console.log('Contador procesos: ') + salir
        res += '\nProceso finalizado, Nos vemos pronto!'
        return res
    }
}





module.exports = ClientController
