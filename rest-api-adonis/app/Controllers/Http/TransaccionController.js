'use strict'
const Database = use('Database')
const Transaccion = use('App/Models/Transaccion');
const Client = use('App/Models/Client');

class TransaccionController {

    async guardarTransaccion(transaccion) {
        //console.log('Trans a guardar: ', transaccion);
        try { 
            await Transaccion.findOrCreate( 
                { id: transaccion.id }, 
                { ...transaccion }
            );
            //console.log('Trans creada/encontrada con exito: ', id_transaccion);
        } catch (e) {
            console.log('Error al crear transaccion: ', transaccion.id);
            console.log('DB Error: ', e);
        }
    }

    async transacciones({ request, response }) {
        var res = null
        if (request.params['id']) {
            const id_cliente = await request.params['id']
            const cliente = await Client.find(id_cliente)
            res = await cliente.transacciones().fetch()
        }
        return (res)? res.toJSON():null;
    }

    async procesarTransacciones(linea, id_cliente, id_pago) {
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
            this.guardarTransaccion(jsonResult)
        }
    };

    async borrarTodo() {
        return await Database.truncate('transaccions').then(function(resu){
            if (resu) {
                console.log('OK borrar todas las transacciones')
                return 'OK borrar todas las transacciones'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar las transacciones')
                return 'Ocurrió un error, no se pueden borrar las transacciones'
            }
        })
    }

    async totalTransacciones() {
        const count = await Database
                                .from('transaccions')
                                .count('* as total')
        var msj = 'Cantidad de transacciones: ' + count[0].total
        //console.log(msj);
        return msj;
    }
}

module.exports = TransaccionController
