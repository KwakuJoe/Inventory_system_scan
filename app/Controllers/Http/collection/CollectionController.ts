import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import CreateCollectionValidator from 'App/Validators/CreateCollectionValidator'


export default class CollectionController {

  public async store({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateCollectionValidator)

    await Collection.create({
      name: payload.name,
      summary: payload.summary,
      category: payload.category,
    })

    session.flash('notification', 'Collection created successfully')

    return response.redirect('back')
  }
}
