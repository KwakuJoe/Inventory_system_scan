import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import Product from '../Models/Product'


export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @column()
  public summary: string

  @column()
  public category: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(model: Collection) {
    model.uuid = uuid()
  }

  // define relationship between collection and product 1:M
  @hasMany(() => Product)
  public products: HasMany<typeof Product>
}
