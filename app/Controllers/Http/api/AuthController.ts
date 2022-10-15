import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginValidator from 'App/Validators/LoginValidator'
import BaseController from '../base/BaseController'

export default class AuthController extends BaseController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { username, passcode } = await request.validate(LoginValidator)

    try {
      const user = await User.query().where('username', username).where('is_mobile_user', 1).first()

      if (!user) {
        return this.notFound(response, 'We could not find user with this username', [])
      }

      const passwordVerified = await Hash.verify(user!.passcode, passcode)
      if (!passwordVerified) {
        return this.sendError(response, 'Authentication failed', [])
      }

      await auth.login(user!)
      return this.sendResponse(response, 'User Authenticated successfully', user)
    } catch (error) {
        return this.sendError(response, 'Authentication failed, try again', [])
    }
  }
}
