import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import SetupAuthValidator from 'App/Validators/SetupAuthValidator'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'

export default class AuthController {
  // show login
  public async showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  // show setup
  public async showSetupAuth({ view }: HttpContextContract) {
    return view.render('auth/setup_auth')
  }

  public async showPasswordReset({ view }: HttpContextContract) {
    return view.render('auth/password_reset')
  }

  public async resetPassword({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(PasswordResetValidator)
    const pincode = payload.pincode
    const passcode = payload.passcode
    const user = await User.query().where('pincode', pincode).first()

    if (!user) {
    session.flash('error', 'Passcode reset failed, Cannot find user with that pincode, try again')
    return response.redirect('back')
    }

    user!.passcode = passcode

    user.save()

    session.flash('notification', 'Passcode reset successfully, Login with new passcode')
    return response.redirect('back')

  }

  public async setupAuth({ request, response, session, auth }: HttpContextContract) {
    const validatedData = await request.validate(SetupAuthValidator)

    try {
      const user = await User.create({
        username: validatedData.username,
        pincode: validatedData.pincode,
        brandName: validatedData.brandName,
        passcode: validatedData.passcode,
        minimumStockNumber: validatedData.minimumStockNumber
      })

      await auth.login(user)

      session.flash(
        'notification',
        'Congrats!, you have successfully set up your authentication and brand. Login with your passcode'
      )

      return response.redirect('back')
    } catch (e) {
      console.log(e)
    }

    // session.flash('notification', 'Congrats!, You have successfully setup your auth')

    return response.redirect('back')
  }

  // login
  public async login({ request, session, response, auth }: HttpContextContract) {
    const { username, passcode, remember } = await request.validate(LoginValidator)

    const user = await User.query().where('username', username).where('is_mobile_user', 0).first()

    // if (!user) {
    //   session.flash('error','Could not find user')
    //   return response.redirect('back')
    // }

    // return response.json({
    //   data: {
    //     a: user,
    //     b: passcode,
    //   },
    // })

    if (!user) {
      session.flash('error', 'We could not find user with this username')
      return response.redirect('back')
    }

    const passwordVerified = await Hash.verify(user!.passcode, passcode)
    if (!passwordVerified) {
      session.flash('error', 'Authentication failed')
      return response.redirect('back')
    }

    await auth.login(user!, remember)
    session.flash('notification', `Welcome ${user!.username}`)
    return response.redirect('/dashboard')
  }

  // logout

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.redirect('/')
  }
}
