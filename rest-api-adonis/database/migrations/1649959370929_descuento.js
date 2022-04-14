'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DescuentoSchema extends Schema {
  up () {
    this.create('descuentos', (table) => {
      table.string('id', 32).notNullable().primary()
      table.integer('monto').notNullable().defaultTo(0)
      table.integer('tipo').notNullable().defaultTo(0) // 0: IVA | 1: Retenciones | 2: Comisiones | 3: Costos extra | 4: Ingresos brutos
      table.string('id_pago', 32).references('id').inTable('pagos')
      table.timestamps()
    })
  }

  down () {
    this.drop('descuentos')
  }
}

module.exports = DescuentoSchema
