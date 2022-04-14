'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagoSchema extends Schema {
  up () {
    this.create('pagos', (table) => {
      //table.increments()
      //table.foreign('causeId').references('Cause.id');
      table.string('id', 32).notNullable().primary()
      table.integer('moneda') // 0: Peso argentino 1: Dolar
      table.integer('monto_total').notNullable().defaultTo(0)
      table.integer('total_descuento').notNullable().defaultTo(0)
      table.integer('total_con_descuento').notNullable().defaultTo(0)
      table.date('fecha_pago').notNullable()
      table.string('id_cliente', 32).references('id').inTable('clientes')
      table.timestamps()
    })
  }

  down () {
    this.drop('pagos')
  }
}

module.exports = PagoSchema
