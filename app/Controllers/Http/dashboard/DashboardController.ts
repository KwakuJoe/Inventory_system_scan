import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Batch from 'App/Models/Batch'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import Env from '@ioc:Adonis/Core/Env'
import ExpiryCategory from 'App/Models/ExpiryCategory'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    // app url
    let appUrl = Env.get('APP_URL')

    // query to fetch first current 5 collection
    const collections = await Collection.query()
      .preload('expiryCategory')
      .withCount('products', (query) => {
        query.as('total_products')
      })
      .orderBy('id', 'desc')
      .limit(5)

    // query product under a collection with total stock of each product
    const products = await Product.query()
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .orderBy('id', 'desc')
      .limit(5)


    // query to count collection created
    const collectionCount = await Database.from('collections').count('* as total')

    // query to sum all stocks under every product in every collection
    const stock = await Product.query()
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .first()

    var stockTotal = '0'

    if (!stock) {
      stockTotal
    } else {
      stockTotal = stock.$extras.stockTotal
    }

    // query to fetch expiry categories
    const categories = await ExpiryCategory.query()

    //query to count expiry product
    const expiry = await ExpiryCategory.query()
      .where('id', 2)
      .withCount('products', (query) => {
        query.as('totalExpiry')
      })
      .first()

      var expiryTotal = '0'

      if (!stock) {
        expiryTotal
      } else {
        expiryTotal = expiry!.$extras.totalExpiry
      }



    //query to count non-expiry
    const nonExpiry = await ExpiryCategory.query()
      .where('id', 1)
      .withCount('products', (query) => {
        query.as('totalNonExpiry')
      })
      .first()

          var nonExpiryTotal = '0'

      if (!stock) {
        nonExpiryTotal
      } else {
        nonExpiryTotal = nonExpiry!.$extras.totalNonExpiry
      }

    // return stock
    return view.render('dashboard/dashboard', {
      collections,
      products,
      collectionCount,
      stock,
      appUrl,
      categories,
      expiryTotal,
      nonExpiryTotal,
      stockTotal,
    })
  }
}
