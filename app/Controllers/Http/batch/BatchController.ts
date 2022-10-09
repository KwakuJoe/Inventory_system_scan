import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Batch from 'App/Models/Batch'
import CreateBatchValidator from 'App/Validators/CreateBatchValidator'

export default class BatchController {

  public async store({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(CreateBatchValidator)

    await Batch.create({
      productId: payload.productId,
      batchStock: payload.batchStock,
      expiryDate: payload.expiryDate,
    })

    session.flash('notification', 'Batch add successfully')

    return response.redirect('back')
  }
}
