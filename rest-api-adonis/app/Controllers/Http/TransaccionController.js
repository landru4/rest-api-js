'use strict'
const Database = use('Database')
const Transaccion = use('App/Models/Transaccion');

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
                console.log('OK borrar todas las trans')
                return 'OK borrar todas las trans'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar las trans')
                return 'Ocurrió un error, no se pueden borrar las trans'
                //response.error('Ocurrió un error, no se pueden borrar las trans')
            }
        })
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
