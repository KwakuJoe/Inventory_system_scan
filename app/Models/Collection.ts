import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column, HasMany, hasMany, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import Product from '../Models/Product'
import Batch from './Batch'
import ExpiryCategory from '../Models/ExpiryCategory'


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
  public expiryCategoryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ExpiryCategory)
  public expiryCategory: BelongsTo<typeof ExpiryCategory>

  @beforeCreate()
  public static async createUUID(model: Collection) {
    model.uuid = uuid()
  }

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  // define relationship with batch through products
  @hasManyThrough([() => Batch, () => Product])
  public batches: HasManyThrough<typeof Batch>
}

