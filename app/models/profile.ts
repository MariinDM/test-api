import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import MyCustomNamingStrategy from '../strategies/custom_strategies.js';

BaseModel.namingStrategy = new MyCustomNamingStrategy();

export default class Profile extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ serializeAs: 'last_name' })
  declare last_name: string

  @column()
  declare address: string

  @column()
  declare phone: string

  @column({ serializeAs: 'user_id' })
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>;
}