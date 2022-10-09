import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Collection from '../Models/Collection'
import Product from './Product'

export default class ExpiryCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Collection)
  public collections: HasMany<typeof Collection>

  // define relationship with batch through products
  @hasManyThrough([() => Product, () => Collection])
  public products: HasManyThrough<typeof Product>
}
