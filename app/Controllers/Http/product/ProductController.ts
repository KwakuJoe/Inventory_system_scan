import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import Application from '@ioc:Adonis/Core/Application'
import { uuid } from 'uuidv4'
import Env from '@ioc:Adonis/Core/Env'
import Batch from 'App/Models/Batch'
import { DateTime } from 'luxon'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'
import Collection from 'App/Models/Collection'

export default class ProductController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    // const products = await Product.query().paginate(page, limit)

    // query product under a collection with total stock of each product
    const products = await Product.query()
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .preload('collection')
      .orderBy('id', 'desc')
      .paginate(page, limit)

    const appUrl = Env.get('APP_URL')
    // Changes the baseURL for the pagination links
    products.baseUrl('/products/all')

    return view.render('dashboard/product_all', { products, appUrl })
  }

  public async showProduct({ params, view, request }: HttpContextContract) {
    // query product and collection info
    const product = await Product.query()
      .where('uuid', params.uuid)
      .preload('collection')
      .firstOrFail()
    let appUrl = Env.get('APP_URL')



    // query the batch list under the product
    const page = request.input('page', 1)
    const limit = 50
    const batches = await Batch.query()
      .preload('product')
      .where('product_id', product.id)
      .orderBy('id', 'desc')
      .paginate(page, limit)

      batches.baseUrl(`/product/${params.uuid}`)

    // stock count for every product
    const stock = await Product.query()
      .where('uuid', params.uuid)
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .firstOrFail()

    // current date
    const currentDate = DateTime.local().toFormat('DDD')

    return view.render('dashboard/product_show', { product, appUrl, batches, stock, currentDate })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateProductValidator)
    if (payload.image.hasErrors) {
      session.flash('error', 'Error with uploading image')
      return response.redirect('back')
    }

    await payload.image.move(Application.publicPath('/upload/product_images'), {
      name: `${uuid()}.${payload.image.extname}`,
    })

    // creating new podcast
    const product = new Product()
    product.name = payload.name
    product.price = payload.price
    product.collectionId = payload.collectionId
    product.image = `/upload/product_images/${payload.image.fileName}`

    // save product
    await product.save()

    session.flash('notification', 'Product created successfully')

    return response.redirect('back')
  }

  // update product
  public async update({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(UpdateProductValidator)
    const productId = payload.productId
    const product = await Product.query().where('id', productId).first()

    if (payload.image) {
      await payload.image.move(Application.publicPath('/upload/product_images'), {
        name: `${uuid()}.${payload.image.extname}`,
      })

      product!.image = `/upload/product_images/${payload.image.fileName}`
    }

    product!.name = payload.name
    product!.price = payload.price, await product!.save()
    session.flash('notification', 'Podcast Updated Successfully')

    return response.redirect('back')
  }

  // delete product
  public async destroy({ params, session, response }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    const collection = await Collection.query().where('id', product.id).first()

    const collectionUUID = collection!.uuid;
    await product.delete()
    session.flash('notification', 'Product Deleted Successfully')
    response.redirect(`/collection/${collectionUUID}`)
  }
}

// /collection/:uuid
