import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import Product from './Product'


export default class Batch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public productId: number

  @column()
  public batchStock: number

  @column.dateTime()
  public expiryDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(model: Batch) {
    model.uuid = uuid()
  }

  @belongsTo(() => Product)
  public batch: BelongsTo<typeof Product>
}
