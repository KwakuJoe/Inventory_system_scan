import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SetupAuthValidator from 'App/Validators/SetupAuthValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class authController {
  public async showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async showSetupAuth({ view }: HttpContextContract) {
    return view.render('auth/setup_auth')
  }

  public async setupAuth({ request, response, session, auth }: HttpContextContract) {
    try {
      const validatedData = await request.validate(SetupAuthValidator)

      const user = await User.create({
        username: validatedData.username,
        pincode: validatedData.pincode,
        brandName: validatedData.brandName,
        passcode: validatedData.passcode,
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

  public async login({ request, session, response, auth }: HttpContextContract) {
    const { username, passcode, remember } = await request.validate(LoginValidator)

    const user = await User.findBy('username', username)

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

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.redirect('/')
  }
}
