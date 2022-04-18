'use strict'

const Database = use('Database')
const Descuento = use('App/Models/Descuento');

class DescuentoController {

    async guardarDescuento(descuento) {
        //console.log('Descuento a guardar: ', descuento);
        try { 
            await Descuento.findOrCreate( 
                { id: descuento.id }, 
                { ...descuento }
            );
            //console.log('Descuento creado/encontrado con exito: ', id_descuento);
        } catch (e) {
            console.log('Error al crear Descuento: ', descuento.id);
            console.log('DB Error: ', e);
        }
    };

    async procesarDescuentos(linea, id_pago) {
        //console.log("Proceso la linea 3");
        var regex = /(3)(\w{32})(\d{13})\s{3}(\d{1})/g;
        const matches = linea.matchAll(regex);
        //console.log(linea);
        var jsonResult
        for (const m of matches) {
            /*console.log("Tipo reg:", m[1]);
            console.log("Id Desc:", m[2]);
            console.log("Monto:", m[3]);
            console.log("Tipo:", m[4]);*/
            jsonResult = 
            {
                id: m[2],
                monto: m[3],
                tipo: m[4],
                id_pago: id_pago
            }
            this.guardarDescuento(jsonResult)
        }
    };

    async borrarTodo() {
        return await Database.truncate('descuentos').then(function(resu){
            if (resu) {
                console.log('OK borrar todos los descuentos')
                return 'OK borrar todos los descuentos'
            }
            else {
                console.log('Ocurrió un error, no se pueden borrar los descuentos')
                return 'Ocurrió un error, no se pueden borrar los descuentos'
            }
        })
    }

    async totalDescuentos() {
        const count = await Database
                                .from('descuentos')
                                .count('* as total')
        var msj = 'Cantidad de descuentos: ' + count[0].total
        //console.log(msj);
        return msj;
    };
}

module.exports = DescuentoController
