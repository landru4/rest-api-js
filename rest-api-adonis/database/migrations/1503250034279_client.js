'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  async up () {
    this.create('clients', (table) => {
      table.string('id', 32).notNullable().primary()
      table.string('email', 254).notNullable().unique()
      table.string('first_name', 60).notNullable()
      table.string('last_name', 60).notNullable()
      table.string('job', 60)
      table.string('country', 60)
      table.string('address', 256)
      table.string('zip_code', 60)
      table.string('phone', 60)
      table.timestamps()
    })
  }

  async down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema

/* Campos obtenidos en la API
{
  "id": "883d07d3e46546719213252c8e99ebb0",
  "email": "nicky.ohara@pfefferprohaska.info",
  "first_name": "Dong",
  "last_name": "Kovacek",
  "job": "Hospitality Officer",
  "country": "Liechtenstein",
  "address": "21302 Ullrich Points",
  "zip_code": "09647-1777",
  "phone": "(190) 202-9226"
}*/