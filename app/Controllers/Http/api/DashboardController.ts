import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import BaseController from '../base/BaseController'

export default class DashboardController extends BaseController{

  public async getCollection({response}: HttpContextContract) {

    try {
      const collection = await Collection.query()
      return this.sendResponse(response, 'Collection queried successfully', {collection})
    } catch (error) {
      return this.sendError(response, 'Failed to get collection', [])
    }

  }
}
