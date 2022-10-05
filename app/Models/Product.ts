import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import Collection from '../Models/Collection'


export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public collectionId: number

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(model: Product) {
    model.uuid = uuid()
  }

  // @belongsTo(() => Collection)
  // public collection: BelongsTo<typeof Collection>

  @belongsTo(() => Collection)
  public collection: BelongsTo<typeof Collection>
}


