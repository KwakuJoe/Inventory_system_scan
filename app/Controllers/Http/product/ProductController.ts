import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import Application from '@ioc:Adonis/Core/Application'
import { uuid } from 'uuidv4'
import Env from '@ioc:Adonis/Core/Env'
import Collection from 'App/Models/Collection'



export default class ProductController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const products = await Product.query().paginate(page, limit)

    // Changes the baseURL for the pagination links
    products.baseUrl('/products/all')

    return view.render('dashboard/product_all', { products })
  }

  public async showProduct({ params, view }: HttpContextContract) {
    const product = await Product.query().where('uuid', params.uuid).first()
    const collection = await Collection.query().where('id', product!.id).first()
    let appUrl = Env.get('APP_URL')
    return view.render('dashboard/product_show', { collection, product, appUrl })
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
