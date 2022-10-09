import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Batch from 'App/Models/Batch'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import Env from '@ioc:Adonis/Core/Env'
import ExpiryCategory from 'App/Models/ExpiryCategory'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
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
      // .where('collection_id', collection.id)
      .orderBy('id', 'desc')
      .limit(5)

    // app url
    let appUrl = Env.get('APP_URL')

    // count collection query
    const collectionCount = await Database.from('collections').count('* as total')

    // Total items in stock from every collection
    const stock = await Batch.query()
      .withAggregate('batch', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .firstOrFail()

    // query to fetch expiry categories
    const categories = await ExpiryCategory.query()

    // query to count expiry product
    const expiry = await ExpiryCategory.query()
      .where('id', 1)
      .withCount('products', (query) => {
        query.as('totalExpiry')
      })
    .firstOrFail()

    // query to count non-expiry
    const nonExpiry = await ExpiryCategory.query()
      .where('id', 2)
      .withCount('products', (query) => {
        query.as('totalNonExpiry')
      })
      .firstOrFail()

    return view.render('dashboard/dashboard', {
      collections,
      products,
      collectionCount,
      stock,
      appUrl,
      categories,
      expiry,
      nonExpiry,
    })
  }
}
