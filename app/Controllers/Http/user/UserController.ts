import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AddUserValidator from 'App/Validators/AddUserValidator'
import SetupAuthValidator from 'App/Validators/SetupAuthValidator'

export default class UserController {
  public async create({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 50

    const users = await User.query()
      .where('is_mobile_user', 1)
      .orderBy('id', 'desc')
      .paginate(page, limit)

    // Changes the baseURL for the pagination links
    users.baseUrl('/users')

    return view.render('dashboard/app_users', { users })
  }

  public async store({ auth, request, session, response }: HttpContextContract) {
    try {
      const validatedData = await request.validate(AddUserValidator)
      const AdminUser = auth.user
      const user = await User.create({
        username: validatedData.username,
        pincode: AdminUser!.pincode,
        brandName: AdminUser!.brandName,
        passcode: validatedData.passcode,
        isMobileUser: true,
      })

      await user.save()

      session.flash('notification', 'Congrats!, you have successfully added an app user')

      return response.redirect('back')
    } catch (e) {
      console.log(e)
    }

    // session.flash('notification', 'Congrats!, You have successfully setup your auth')

    return response.redirect('back')
  }

  // delete product
  public async destroy({ params, session, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    await user.delete()
    session.flash('notification', 'Product Deleted Successfully')
    response.redirect('back')
  }
}
