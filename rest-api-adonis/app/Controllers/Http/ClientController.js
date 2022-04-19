'use strict'


const Client = use('App/Models/Client');
const Database = use('Database')

const esperaReintentarObtenerCliente = 30000

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

class ClientController {

    async clientes({ response }) {
        const clients = await Client.all()
        return response.ok(clients)
    }

    async cliente({ request, response }) {
        const id_cliente = request.params['id']
        const cliente = await Client.find(id_cliente)
        return (cliente)? cliente.toJSON():null;
    }

    async extraerDatosLinea4(linea) {
        var regex = /(4)\s{15}(\d{8})(\w{32})/g;
        const matches = linea.matchAll(regex);
        var jsonResult
        for (const m of matches) {
            /*console.log('Tipo reg:', m[1]);
            console.log('Fecha pago:', m[2]);
            console.log('Id Cliente:', m[3]);*/
            jsonResult = 
            {
                fecha_pago: m[2],
                id_cliente: m[3]
            }
            await guardarClienteDummy(m[3]);
        }
        return jsonResult; // Retorna fecha de pago y el id del cliente
    };

    async obtenerClienteAPI(id_cliente) {
        const cliente = await Client.find(id_cliente)
        if (cliente.id == cliente.email) {
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
        }
    };

    async borrarTodo() {
        return await Database.truncate('clients').then(function(resu) {
            if (resu) {
                console.log('OK borrar todos los clientes')
                return 'OK borrar todos los clientes\n'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los clientes')
                return 'Ocurrió un error, no se pueden borrar los clientes\n'
            } 
        }) + '\n'
    };

    async totalClientes() {
        const count = await Database
                                .from('clients')
                                .count('* as total')
        var msj = 'Cantidad de clientes: ' + count[0].total
        //console.log(msj);
        return msj;
    };
}

module.exports = ClientController
