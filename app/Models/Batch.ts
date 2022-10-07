import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'


export default class Batch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column.dateTime()
  public dateAdded: DateTime

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
}
