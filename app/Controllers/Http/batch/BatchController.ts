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

  public async showBatchQRCode({ view, params }: HttpContextContract) {
    const batch = await Batch.query().where('uuid', params.uuid).first()

    return view.render('dashboard/show_qr_code', { batch })
  }

  // delete product
  public async destroy({ params, session, response }: HttpContextContract) {
    const batch = await Batch.findOrFail(params.id)

    await batch.delete()
    session.flash('notification', 'Batch deleted successfully')
    response.redirect('back')
  }
}
