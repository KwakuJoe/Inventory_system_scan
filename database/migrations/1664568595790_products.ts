import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable()
      // table.integer('collection_id').unsigned()
      table.string('name').notNullable()
      table.integer('price').notNullable()
      table.string('image').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
      this.schema.alterTable('products', (table) => {
        table.integer('collection_id').unsigned().references('collections.id').onDelete('CASCADE')
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
