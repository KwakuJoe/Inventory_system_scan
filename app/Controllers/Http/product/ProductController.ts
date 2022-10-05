import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import Application from '@ioc:Adonis/Core/Application'

export default class ProductController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const products = await Product.query().paginate(page, limit)

    // Changes the baseURL for the pagination links
    products.baseUrl('/products/all')

    return view.render('dashboard/product_all', { products })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateProductValidator)

    const imageName = new Date().getTime().toString() + `.${payload.image.extname}`

    await payload.image.move(Application.publicPath('photos'), {
      name: imageName,
    })

    await Product.create({
      name: payload.name,
      price: payload.price,
      collectionId: payload.collectionId,
      image:imageName

    })

    session.flash('notification', 'Product created successfully')

    return response.redirect('back')
  }
}
