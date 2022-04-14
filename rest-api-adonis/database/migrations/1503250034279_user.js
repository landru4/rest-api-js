'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  async up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
    /*
    {
      "email": "test6landru@gmail.com",
      "password": "123456"
    }
    */
    // Password cifrada: $2a$10$LeNsuG1RFtvZWJbJEUkch.bvhuDUKVixk0VPD9RLQ5MjPUzijJ6t2

    //Token 7cba008e3783a9d558d39bfba1294fffjjSfCVL27kEoqG2PiR53pqNoNQYd/bqgbNtRIzPNPROD37wDZRAADXkj5fNlfK2n

  }

  async down () {
    this.drop('users')
  }
}

module.exports = UserSchema
