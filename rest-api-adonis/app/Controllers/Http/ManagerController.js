'use strict'


const ClientController = use('./ClientController');
const PagoController = use('./PagoController');
const TransaccionController = use('./TransaccionController');
const DescuentoController = use('./DescuentoController');

global.salir = false

const esperaObtenerProximoArchivo = 600000
const esperaReintentarObtenerArchivo = 30000

const clienteC = new ClientController()
const pagoC = new PagoController()
const transC = new TransaccionController()
const descC = new DescuentoController()

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
        console.log('Obteniendo archivo...intento ', cantIntentos, ' Hora: ' , new Date(Date.now()).toLocaleString());

        return new Promise((resolve, reject) => {
            request(options, function(error, res) {
                if (error || res.statusCode !== 200) {
                    console.log('Error al obtener el archivo');
                    setTimeout( function() { resolve(result()) },  esperaReintentarObtenerArchivo);
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

async function procesoDataArchivo(regText) {
    console.log('Procesando datos del archivo (clientes, pagos, transacciones, descuentos)')
    var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g
    var cantidad = 0;
    const matches = regText.matchAll(r);
    for (const m of matches) {
        cantidad++;
        /*if (cantidad > 5) {
            console.log('HAY MAS DE 5 CLIENTES:', cantidad) // TODO: utilizado para pruebas, comentar estas lineas
            break
        }*/
        var jLinea4 = await clienteC.extraerDatosLinea4(m[6]);
        var pago = { ...await pagoC.extraerDatosPago(m[1]), ...jLinea4 }

        await pagoC.guardarPago(pago)
        await Promise.all([transC.procesarTransacciones(m[2], pago.id_cliente, pago.id), descC.procesarDescuentos(m[4], pago.id), clienteC.obtenerClienteAPI(jLinea4.id_cliente)])
    }
    console.log('Se guardaron ', cantidad, ' pagos y clientes obtenidos del archivo')
    console.log('Se ha procesado el archivo exitosamente')
}

async function procesoGeneral() {
    var res = '';
    try {
        const msj = 'Proxima obtencion de archivo desde la API: ' + new Date(Date.now() + esperaObtenerProximoArchivo).toLocaleString() + '\n'
        await procesoDataArchivo(await intentoObtenerArhivo())  
        res += await clienteC.totalClientes() + '\n'
        res += await pagoC.totalPagos() + '\n'
        res += await transC.totalTransacciones() + '\n'
        res += await descC.totalDescuentos() + '\n'
        res += msj
        console.log(res)
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
                setTimeout( function() { resolve(result()) }, esperaObtenerProximoArchivo );
            }
        })
    });
    res += await result();
    console.log('Finalizara la actualizacion de los datos desde la API\n');
    return res
}

class ManagerController {
    async iniProceso({ req, auth, response }) {
        salir = false
        var res = '';
        try {
            await auth.check()
                console.log('Autenticacion OK')
                res += 'Autenticacion OK\n'
        } catch (error) {
            console.log('Token invalido o ausente')
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
            return 'Token invalido o ausente'
        }
        salir = true
        res += '\nProceso finalizado, Nos vemos pronto!'
        return res
    }

    async borrarTodo() {
        var res = '';
        res += await transC.borrarTodo() + '\n'
        res += await descC.borrarTodo() + '\n'
        res += await pagoC.borrarTodo() + '\n'
        return res;
    }
}

module.exports = ManagerController
