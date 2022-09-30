import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'

export default class DashboardController {

  public async index({ view }: HttpContextContract) {
    const collections = await Collection.query().orderBy('id','desc')
    return view.render('dashboard/dashboard', { collections })
  }

}
