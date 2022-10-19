
import Route from '@ioc:Adonis/Core/Route'

//Api routes
Route.group(() => {
  Route.post('auth/login', 'api/AuthController.login')
  Route.get('/scan/:uuid', 'api/ScanController.scanQrCode')
  Route.get('/scan-to-sell/:uuid', 'api/ScanController.scanToSell')

  // dashboard sumaru routes
  Route.get('/get-collections', 'api/DashboardController.getCollection')
  Route.get('/get-products/:collectionId', 'api/DashboardController.getProducts')
  Route.get('/get-product/:id', 'api/DashboardController.getProduct')
}).prefix('api')
