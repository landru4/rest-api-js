'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagoSchema extends Schema {
  up () {
    this.create('pagos', (table) => {
      //table.increments()
      //table.foreign('causeId').references('Cause.id');
      table.integer('id').notNullable().unique()
      table.integer('moneda')
      table.integer('monto_total').notNullable().defaultTo(0)
      table.integer('total_descuento').notNullable().defaultTo(0)
      table.integer('total_con_descuento').notNullable().defaultTo(0)
      table.datetime('fecha_pago').notNullable()
      table.integer('id_cliente').notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('pagos')
  }
}

module.exports = PagoSchema
