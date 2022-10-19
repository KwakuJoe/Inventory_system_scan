/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './routes/api_routes'

Route.group(() => {

  // auth
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'authController.showLogin')
      Route.get('/auth-setup', 'authController.showSetupAuth')
      Route.post('/register', 'authController.setupAuth')
      Route.post('/login', 'authController.login')
    }).middleware('guest')

    Route.post('/logout', 'AuthController.logout')
  }).namespace('App/Controllers/Http/auth')

  // dashboard
  Route.group(() => {
    Route.get('/dashboard', 'DashboardController.index')
  })
    .namespace('App/Controllers/Http/dashboard')
    .middleware('auth')

  // collections
  Route.group(() => {
    Route.resource('collections', 'collection/CollectionController').except([
      'show',
      'index',
      'update',
    ])
    Route.get('/collection/:uuid', 'collection/CollectionController.showCollection').as(
      'collection.show'
    )
    Route.get('/collections/all/:page?', 'collection/CollectionController.index').as(
      'collection.index'
    )
    Route.post('/collection/update', 'collection/CollectionController.update').as(
      'collection.update'
    )
    Route.post('/collection/:id', 'collection/CollectionController.destroy')
  }).middleware('auth')

  // products
  Route.group(() => {
    Route.resource('/products', 'product/ProductController').except([
      'show',
      'index',
      'update',
      'edit',
    ])
    Route.get('/product/:uuid', 'product/ProductController.showProduct').as('product.show')
    Route.get(
      '/product/finished-batches/:id/:uuid',
      'product/ProductController.showProductBatchHistory'
    ).as('product-finished-batches.show')
    Route.get('/products/all/:page?', 'product/ProductController.index').as('product.index')
    Route.post('/product/update', 'product/ProductController.update').as('product.update')
    Route.post('/product/:id', 'product/ProductController.destroy')
  }).middleware('auth')

  // btaches
  Route.group(() => {
    Route.resource('/batches', 'batch/BatchController').except([
      'show',
      'index',
      'update',
      'create',
      'edit',
    ])
    Route.post('/batch/:id', 'batch/BatchController.destroy')
    Route.get('/batch-show-qrCode/:uuid', 'batch/BatchController.showBatchQRCode').as(
      'batchQrCode.show'
    )
  }).middleware('auth')

  // searh
  Route.group(() => {
    Route.get('/search/:term', 'search/SearchController.search').as('search.all')
  }).middleware('auth')

  // users
  Route.group(() => {
    Route.get('/users', 'user/UserController.create').as('users.all')
    Route.post('/users/add', 'user/UserController.store').as('users.add')
    Route.post('/user/remove/:id', 'user/UserController.destroy').as('user.delete')
  }).middleware('auth')
})




