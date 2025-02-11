import Profile from '#models/profile'
import User from '#models/user'
import { createProfileValidator, createUserValidator, updateProfileValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {

    const users = await User
      .query()
      .preload('profile')
      .preload('role')

    return response.ok({
      message: 'List of users',
      data: users
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {

    const data = request.all()

    try {
      var payloadUser = await vine.validate({ schema: createUserValidator, data })
      var payloadProfile = await vine.validate({ schema: createProfileValidator, data })
    }
    catch (error) {
      return response.badRequest({
        message: 'Error validating user and profile',
        error: error.message
      });
    }

    const { nickname, email, password, role_id } = payloadUser
    const { name, last_name, phone, address } = payloadProfile

    const trx = await db.transaction()

    try {
      const user = await User.create({
        nickname,
        email,
        password,
        role_id
      }, { client: trx })


      await user.related('profile').create({
        name,
        last_name,
        phone,
        address,
        user_id: user.id
      }, { client: trx })

      await trx.commit()

      return response.created({
        message: 'User created',
        data: user
      })
    }
    catch (error) {
      await trx.rollback()
      return response.badRequest({
        message: 'Error creating user',
        error: error.message
      });
    }

  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {

    const user = await User.findOrFail(params.id)

    await user.load('profile')
    await user.load('role')

    return response.ok({
      message: 'User detail',
      data: user
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.all();

    try {
      var payloadUser = await vine.validate({ schema: updateUserValidator, data });
      var payloadProfile = await vine.validate({ schema: updateProfileValidator, data });
    } catch (error) {
      return response.badRequest({
        message: 'Error validating user and profile',
        error: error.message,
      });
    }

    const { nickname, email, role_id } = payloadUser;
    const { name, last_name, phone, address } = payloadProfile;

    const user = await User.findOrFail(params.id);
    const profile = await Profile.findByOrFail('user_id', user.id);

    const trx = await db.transaction();

    try {
      const userUpdateData: any = {
        nickname,
        email,
        role_id
      };

      if (data.password) {
        userUpdateData.password = data.password;
      }

      await user.useTransaction(trx).merge(userUpdateData).save();

      await profile.useTransaction(trx).merge({
        name,
        last_name,
        phone,
        address,
      }).save();

      await trx.commit();

      return response.ok({
        message: 'User updated',
        data: user,
      });

    } catch (error) {
      await trx.rollback();
      return response.badRequest({
        message: 'Error updating user',
        error: error.message,
      });
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {

    const user = await User.findOrFail(params.id)

    user.active = !user.active

    await user.save()

    return response.ok({
      message: 'User changed status',
      data: user
    })
  }
}