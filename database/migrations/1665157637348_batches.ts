import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'batches'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uuid').notNullable()
      table.integer('batch_stock').notNullable()
      table.dateTime('date_add').notNullable()
      table.dateTime('expiry_date').nullable()
      table.timestamps(true, true)
      this.schema.alterTable('batches', (table) => {
        table.integer('product_id').unsigned().references('products.id').onDelete('CASCADE')
      })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
