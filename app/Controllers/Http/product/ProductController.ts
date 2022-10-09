import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import Application from '@ioc:Adonis/Core/Application'
import { uuid } from 'uuidv4'
import Env from '@ioc:Adonis/Core/Env'
import Batch from 'App/Models/Batch'

export default class ProductController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const products = await Product.query().paginate(page, limit)
    const appUrl = Env.get('APP_URL')
    // Changes the baseURL for the pagination links
    products.baseUrl('/products/all')

    return view.render('dashboard/product_all', { products, appUrl })
  }

  public async showProduct({ params, view, request }: HttpContextContract) {
    // query product and collection info
    const product = await Product.query().where('uuid', params.uuid).preload('collection').firstOrFail()
    let appUrl = Env.get('APP_URL')

    // query the batch list under the product
    const page = request.input('page', 1)
    const limit = 50
    const batches = await Batch.query().where('product_id', product.id).orderBy('id', 'desc').paginate(page, limit)

    // stock count for every product
    const stock = await Product.query()
      .where('uuid', params.uuid)
      .withAggregate('batches', (query) => {
        query.sum('batch_stock').as('stockTotal')
      })
      .firstOrFail()

    return view.render('dashboard/product_show', { product, appUrl, batches, stock })
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
}
