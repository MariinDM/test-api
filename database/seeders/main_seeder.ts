import Profile from '#models/profile'
import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {

    await Role.createMany([
      {
        name: 'admin',
        description: 'Administrator',
      },
      {
        name: 'support',
        description: 'Support',
      },
    ])

    await User.createMany([
      {
        email: 'admin@admin.com',
        password: 'admin',
        nickname: 'admin',
        role_id: 1,
      },
      {
        email: 'support@support.com',
        password: 'support',
        nickname: 'support',
        role_id: 2,
      },
    ])

    await Profile.createMany([
      {
        name: 'Admin',
        last_name: 'Admin',
        address: 'Admin street',
        phone: '123456789',
        user_id: 1,
      },
      {
        name: 'Support',
        last_name: 'Support',
        address: 'Support street',
        phone: '987654321',
        user_id: 2,
      }
    ])
  }
}