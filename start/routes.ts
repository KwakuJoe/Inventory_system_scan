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

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'authController.showLogin')
    Route.get('/auth-setup', 'authController.showSetupAuth')
    Route.post('/register', 'authController.setupAuth')
    Route.post('/login', 'authController.login')
  }).middleware('guest')

  Route.post('/logout', 'AuthController.logout')
}).namespace('App/Controllers/Http/auth')

Route.group(() => {
  Route.get('/dashboard', 'DashboardController.index')
})
  .namespace('App/Controllers/Http/dashboard')
  .middleware('auth')

Route.group(() => {
  Route.resource('collections', 'collection/CollectionController').except(['show', 'index', 'update'])
  Route.get('/collection/:uuid', 'collection/CollectionController.showCollection').as(
    'collection.show'
  )
  Route.get('/collections/all/:page?', 'collection/CollectionController.index').as(
    'collection.index'
  )
  Route.post('/collection/update', 'collection/CollectionController.update').as('collection.update')
  Route.post('/collection/:id', 'collection/CollectionController.destroy')
}).middleware('auth')

Route.group(() => {
  Route.resource('/products', 'product/ProductController').except(['show','index'])
  Route.get('/product/:uuid', 'product/ProductController.showProduct').as('product.show')
    Route.get('/products/all/:page?', 'product/ProductController.index').as('product.index')
}).middleware('auth')

Route.group(() => {
  Route.resource('/batches', 'batch/BatchController').except(['show','index','update','create', 'edit'])

})

Route.group(() => {
  Route.get('/search/:term', 'search/SearchController.search').as('search.all')
})
