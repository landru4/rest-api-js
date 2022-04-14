'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransaccionSchema extends Schema {
  up () {
    this.create('transaccions', (table) => {
      table.string('id', 32).notNullable().primary()
      table.integer('monto_total').notNullable().defaultTo(0)
      table.integer('tipo').notNullable().defaultTo(2) // 1: Aprobado | 2: Rechazado | (por defecto 2 Rechazado)
      //table.string('id_cliente').references('id').inTable('clientes')
      table.string('id_pago', 32).references('id').inTable('pagos')
      table.timestamps()
    })
  }

  down () {
    this.drop('transaccions')
  }
}

module.exports = TransaccionSchema
