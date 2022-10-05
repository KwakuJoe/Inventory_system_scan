import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import SearchValidator from 'App/Validators/SearchValidator'

export default class SearchController {
  public async search({ view, params, request }: HttpContextContract) {
    const payload = await request.validate(SearchValidator)

    params.term = payload.name

    const products = await Product.query()
      .where('name', 'LIKE', '%' + params.term + '%')
      .preload('collection')

    const collections = await Collection.query().where('name', 'LIKE', '%' + params.term + '%')
    // .preload('products')

    const term = params.term

    // const colection = await Collection.query().where('id', product.)

    return view.render('dashboard/search', { products, collections, term })
  }
}
