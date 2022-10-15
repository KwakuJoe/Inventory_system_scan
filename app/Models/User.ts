import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { uuid } from 'uuidv4'



export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public pincode: string

  @column()
  public username: string

  @column()
  public brandName: string

  @column()
  public isMobileUser: boolean

  @column()
  public rememberMeToken: string

  @column({ serializeAs: null })
  public passcode: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.passcode) {
      user.passcode = await Hash.make(user.passcode)
    }
  }

  @beforeCreate()
  public static async createUUID(model: User) {
    model.uuid = uuid()
  }
}
