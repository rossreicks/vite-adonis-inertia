import User from 'App/Models/User';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UsersController {
  public async index({ inertia, request }: HttpContextContract) {
    const users = await User.all();

    return inertia.render('Users/IndexPage', { users });
  }
}
