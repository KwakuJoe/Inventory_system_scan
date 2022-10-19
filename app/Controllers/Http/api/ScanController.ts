import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Batch from 'App/Models/Batch'
import Collection from 'App/Models/Collection'
import Product from 'App/Models/Product'
import BaseController from '../base/BaseController'

export default class ScanController extends BaseController {
  public async scanQrCode({ response, params }: HttpContextContract) {
    try {
      // query the batch
      const batch = await Batch.query().where('uuid', params.uuid).preload('product').first()

      if (!batch) {
        return this.notFound(response, 'Could not find product with this qr code', [])
      }

      // use the batch id to get the product it belongs to and count all the batch under it
      const product = await Product.query()
        .withAggregate('batches', (query) => {
          query.sum('batch_stock').as('stockTotal')
        })
        .where('id', batch!.productId)
        .preload('collection')
        .first()

      var stockTotal = 0
      if (product!.$extras.stockTotal == null) {
        product!.$extras.stockTotal = 0
      } else {
        stockTotal = product!.$extras.stockTotal
      }

      // user the id to ge the collection

      const collection = await Collection.query().where('id', product!.collectionId).first()

      const collectionName = collection!.name

      return this.sendResponse(response, 'Product scan successfully', {
        batch,
        stockTotal,
        collectionName,
      })
    } catch (error) {
      return this.sendError(response, error.message, [])
    }
  }






  public async scanToSell({ response, params }: HttpContextContract) {
    try {
      const batch = await Batch.query()
        .where('uuid', params.uuid)
        .where('batch_stock', '>', 0)
        .decrement('batch_stock', 1)
        .preload('product')
        .first()

      if (!batch) {
        return this.notFound(response, 'Could not find product with this qr code', [])
      }

      const getBatch = await Batch.query().where('uuid', params.uuid).first()
      const batchUUID = getBatch!.uuid
      const batchStock = getBatch!.batchStock
      const batchExpiry = getBatch!.expiryDate



      // use the batch id to get the product it belongs to and count all the batch under it
      const batchIdPid = getBatch!.productId
      const product = await Product.query()
        .withAggregate('batches', (query) => {
          query.sum('batch_stock').as('stockTotal')
        })
        .where('id', batchIdPid)
        .preload('collection')
        .first()

      const productName = product!.name
      const productPrice = product!.price

      var stockTotal = 0
      if (product!.$extras.stockTotal == null) {
        product!.$extras.stockTotal = 0
      } else {
        stockTotal = product!.$extras.stockTotal
      }

      // user the id to ge the collection
      const collection = await Collection.query().where('id', product!.collectionId).first()
      const collectionName = collection!.name
      const collectionID = collection!.id

      return this.sendResponse(response, 'Product Sold successfully', {
        productName,
        productPrice,
        collectionName,
        collectionID,
        stockTotal,
        batchUUID,
        batchStock,
        batchExpiry,
      })
    } catch (error) {
      return this.sendError(response, error.message, [])
    }
  }
}
