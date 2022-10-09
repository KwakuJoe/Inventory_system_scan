import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import CreateCollectionValidator from 'App/Validators/CreateCollectionValidator'
import UpdateCollectionValidator from 'App/Validators/UpdateCollectionValidator'
import Env from '@ioc:Adonis/Core/Env'
import ExpiryCategory from 'App/Models/ExpiryCategory'
export default class CollectionController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const collections = await Collection.query().paginate(page, limit)

    // Changes the baseURL for the pagination links
    collections.baseUrl('/collections/all')

    return view.render('dashboard/collection_all', { collections })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateCollectionValidator)

    await Collection.create({
      name: payload.name,
      summary: payload.summary,
      expiryCategoryId: payload.expiryCategoryId,
    })

    session.flash('notification', 'Collection created successfully')

    return response.redirect('back')
  }


  public async update({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(UpdateCollectionValidator)
    const id = payload.id

    const collection = await Collection.findOrFail(id)
    collection.name = payload.name,

      collection.summary = payload.summary,

      collection.expiryCategoryId = payload.expiryCategory,

      await collection.save()

    session.flash('notification', 'Collection updated successfully')
    return response.redirect('back')
  }




  public async showCollection({ view, params }: HttpContextContract) {
    const collection = await Collection.query()
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('collectionStockTotal')
      })
      .where('uuid', params.uuid)
      .firstOrFail()

    // app url
    let appUrl = Env.get('APP_URL')

    // query product under a collection with total stock of each product
    const products = await Product.query()
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .where('collection_id', collection.id)
      .orderBy('id', 'desc')

    // total product under this collection
    const totalProduct = await Collection.query()
      .withCount('products', (query) => {
        query.as('totalProductPerCollection')
      })
      .where('uuid', params.uuid)
      .firstOrFail()

    return view.render('dashboard/collection_show', { collection, products, appUrl, totalProduct })

  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const collection = await Collection.findOrFail(params.id)
    await collection.delete()
    session.flash('notification', 'Collection Deleted Successfully')
    response.redirect('/dashboard')
  }
}
