
import Route from '@ioc:Adonis/Core/Route'

//Api routes
Route.group(() => {
  Route.post('auth/login', 'api/AuthControllerAPI.login')
  Route.get('/scan/:uuid', 'api/ScanController.scanQrCode')
  Route.get('/scan-to-sell/:uuid', 'api/ScanController.scanToSell')

  // dashboard sumaru routes
  Route.get('/get-collections', 'api/DashboardControllerAPI.getCollection')
  Route.get('/get-products/:collectionId', 'api/DashboardControllerAPI.getProducts')
  Route.get('/get-product/:id', 'api/DashboardControllerAPI.getProduct')
}).prefix('api')
