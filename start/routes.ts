/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const UsersController = () => import('#controllers/users_controller')


router.group(() => {

  router.get('users', [UsersController, 'index'])
  router.post('users', [UsersController, 'store'])
  router.get('users/:id', [UsersController, 'show'])
  router.put('users/:id', [UsersController, 'update'])
  router.delete('users/:id', [UsersController, 'destroy'])

}).prefix('api/v1')
