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

    async extraerDatosPago(linea1) {
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
        //return  { ...jsonLinea1, ...jLinea4 };
        return  jsonLinea1;
    };
}

module.exports = PagoController
