'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class Client extends Model {
  static get primaryKey () {
    return 'id'
  }
  /*static boot () {
    super.boot()
  }*/

  pagos () {
    return this.hasMany('App/Models/Pago', 'id', 'id_cliente')
  }

  transacciones () {
    return this.hasMany('App/Models/Transaccion', 'id', 'id_cliente')
  }
}

module.exports = Client
