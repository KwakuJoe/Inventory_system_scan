import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import BaseController from '../base/BaseController'

export default class DashboardController extends BaseController {
  public async getCollection({ response }: HttpContextContract) {
    try {
      const collections = await Collection.query().preload('expiryCategory').orderBy('id', 'desc')

      // array.forEach(element => {

      // });

      return this.sendResponse(response, 'Collection queried successfully', { collections })
    } catch (error) {
      return this.sendError(response, 'Failed to get collection', [])
    }
  }

  public async getProducts({ response, params }: HttpContextContract) {
    try {
      const product = await Product.query()
        .where('collection_id', params.collectionId)
        .orderBy('id', 'desc')

      return this.sendResponse(response, 'Products queried successfully', { product })
    } catch (error) {
      return this.sendError(response, 'Failed to get products', [])
    }
  }

  public async getProduct({ response, params }: HttpContextContract) {
    try {
      const product = await Product.query()
        .where('id', params.id)
        .withAggregate('batches', (query) => {
          query.sum('batch_stock').as('stockTotal')
        })
        .firstOrFail()

      var stockTotal = '0'

      if (product.$extras.stockTotal == null) {
        stockTotal
      } else {
        stockTotal = product.$extras.stockTotal
      }
      return this.sendResponse(response, 'Products queried successfully', { product, stockTotal })
    } catch (error) {
      return this.sendError(response, 'Failed to get products', [])
    }
  }
}
