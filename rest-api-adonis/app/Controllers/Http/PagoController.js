'use strict'

const Pago = use('App/Models/Pago');
const Client = use('App/Models/Client');
const Database = use('Database')

// Total pago para un cliente
async function pagoAnteriores(id_cliente) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    const cliente = await Client.find(id_cliente)
    //const res = await cliente.pagos().where('fecha_pago', '<=', yyyy+mm+dd).fetch()
    const arsPagos = await cliente.pagos().where('moneda', 0).where('fecha_pago', '<=', yyyy+mm+dd).fetch();
    const usdPagos = await cliente.pagos().where('moneda', 1).where('fecha_pago', '<=', yyyy+mm+dd).fetch();

    const total_con_descuento_ar = await cliente.pagos().where('moneda', 0).where('fecha_pago', '<=', yyyy+mm+dd).sum('total_con_descuento as total_con_descuento_ar');
    const total_con_descuento_usd = await cliente.pagos().where('moneda', 1).where('fecha_pago', '<=', yyyy+mm+dd).sum('total_con_descuento as total_con_descuento_usd');
    return { ars: arsPagos.toJSON(), total_ars: total_con_descuento_ar, usd: usdPagos.toJSON(),  total_usd: total_con_descuento_usd };
}

async function pagoFuturos(id_cliente) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    const cliente = await Client.find(id_cliente)
    const arsPagos = await cliente.pagos().where('moneda', 0).where('fecha_pago', '>', yyyy+mm+dd).fetch();
    const usdPagos = await cliente.pagos().where('moneda', 1).where('fecha_pago', '>', yyyy+mm+dd).fetch();
    
    const total_con_descuento_ar = await cliente.pagos().where('moneda', 0).where('fecha_pago', '>', yyyy+mm+dd).sum('total_con_descuento as total_con_descuento_ar');
    const total_con_descuento_usd = await cliente.pagos().where('moneda', 1).where('fecha_pago', '>', yyyy+mm+dd).sum('total_con_descuento as total_con_descuento_usd');
    return { ars: arsPagos.toJSON(), total_ars: total_con_descuento_ar, usd: usdPagos.toJSON(), total_usd: total_con_descuento_usd };
}

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

    async pagos({ request, response }) {
        const id_cliente = request.params['id']
        return { anteriores: await pagoAnteriores(id_cliente), futuros: await pagoFuturos(id_cliente) }
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

    async borrarTodo() {
        return await Database.truncate('pagos').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los pagos')
                return 'OK borrar todos los pagos\n'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los pagos')
                return 'Ocurrió un error, no se pueden borrar los pagos\n'
            }
        })
    }

    async totalPagos() {
        const count = await Database
                                .from('pagos')
                                .count('* as total')
        var msj = 'Cantidad de pagos: ' + count[0].total
        //console.log(msj);
        return msj;
    }
}

module.exports = PagoController
