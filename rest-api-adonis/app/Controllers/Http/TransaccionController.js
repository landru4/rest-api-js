'use strict'

const Transaccion = use('App/Models/Transaccion');

class TransaccionController {

    async guardarTransaccion(transaccion) {
        //console.log('Trans a guardar: ', transaccion);
        try { 
            await Transaccion.findOrCreate( 
                {
                    id: transaccion.id
                }, 
                { ...transaccion }
            );
            //console.log('Trans creada/encontrada con exito: ', id_transaccion);
        } catch (e) {
            console.log('Error al crear transaccion: ', transaccion.id);
            console.log('DB Error: ', e);
        }
    }

    /*
    async guardarTransaccion(id_transaccion, monto_total, tipo, id_cliente, id_pago) {
        try { 
            await Transaccion.findOrCreate( 
                {
                    id: id_transaccion
                }, 
                {
                    id: id_transaccion,
                    monto_total: monto_total,
                    tipo: tipo,
                    id_cliente: id_cliente,
                    id_pago: id_pago
                }
            );
            console.log('Transaccion creada/encontrada con exito: ', id_transaccion);
        } catch (e) {
            console.log('Error al crear transaccion: ', id_transaccion);
            console.log('DB Error: ', e);
        }
    }*/
}

module.exports = TransaccionController
