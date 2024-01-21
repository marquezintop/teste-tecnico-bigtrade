import { EmailAlreadyUsedError } from '../errors/index'
import { PublicUser, UserView } from '../interfaces/user-interface'
import UserModel from '../models/user-model'

export default class UserService {
  constructor(
    private usersModel = new UserModel(),
  ) {}

  public async postUser(userView: UserView): Promise<PublicUser> {
    const emailAlreadyInUse = await this.usersModel.getUserByEmail(userView.email)

    if (emailAlreadyInUse) throw new EmailAlreadyUsedError()

    const userCreated = await this.usersModel.createUser(userView)

    return userCreated
  }
}
