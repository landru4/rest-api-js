'use strict'

const Pago = use('App/Models/Pago');

class PagoController {
    async guardarPago(pago) {
        //console.log('Pago a guardar: ', pago);
        try { 
            await Pago.findOrCreate( 
                { id: pago.id }, 
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
            //console.log('Pago creado/encontrado con exito: ', pago.id);
        } catch (e) {
            console.log('Error al crear pago: ', pago.id);
            console.log('DB Error: ', e);
        }
    }

    // Total pago para un cliente
    async totalPago(id_cliente) {
        const monto = await Database
                                .from('pagos')
                                .where('id_cliente=' + id_cliente)
                                .sum('monto_total as total')
        const total = monto[0].total
        console.log('Monto total pagos: ', total);
        return total;
    }
}

module.exports = PagoController
