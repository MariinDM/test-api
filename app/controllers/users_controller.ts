import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {

    const users = await User
      .query()
      .where('active', true)
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

    const payload = await vine.validate({ schema: createUserValidator, data })

    const user = await User.create(payload)

    return response.created({
      message: 'User created',
      data: user
    })

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

    const data = request.all()

    const payload = await vine.validate({ schema: updateUserValidator, data })

    const user = await User.findOrFail(params.id)

    user.merge(payload)

    await user.save()

    return response.ok({
      message: 'User updated',
      data: user
    })

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