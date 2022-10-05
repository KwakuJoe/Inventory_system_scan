import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    const collections = await Collection.query().orderBy('id', 'desc').limit(5)
    const products = await Product.query().orderBy('id', 'desc').limit(5)

    // count collection query
    const collectionCount = await Database
  .from('collections')
  .count('* as total')

    return view.render('dashboard/dashboard', { collections, products, collectionCount })
  }


}
