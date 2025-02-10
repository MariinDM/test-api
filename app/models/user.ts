import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import Profile from './profile.js'
import Role from './role.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nickname: string | null

  @column()
  declare email: string

  @column()
  declare active: boolean

  @column()
  declare role_id: number

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasOne(() => Profile, { localKey: 'id', foreignKey: 'user_id' })
  declare profile: HasOne<typeof Profile>

  @belongsTo(() => Role, { localKey: 'id', foreignKey: 'role_id' })
  declare role: BelongsTo<typeof Role>
}