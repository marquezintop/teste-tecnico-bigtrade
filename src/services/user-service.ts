import { isValidObjectId } from 'mongoose'
import { ObjectId } from 'mongodb'
import { EmailAlreadyUsedError, InvalidIdError } from '../errors/index'
import { PublicUser, UserView } from '../interfaces/user-interface'
import UserModel from '../models/user-model'

export default class UserService {
  constructor(
    private userModel = new UserModel(),
  ) {}

  public async postUser(userView: UserView): Promise<PublicUser> {
    const emailAlreadyInUse = await this.userModel.getUserByEmail(userView.email)

    if (emailAlreadyInUse) throw new EmailAlreadyUsedError()

    const userCreated = await this.userModel.createUser(userView)

    return userCreated
  }

  public async findUserById(id: string): Promise<PublicUser> {
    if (!isValidObjectId(id)) throw new InvalidIdError()

    const objectId = new ObjectId(id)

    const user = await this.userModel.getUserById(objectId)

    if (!user) throw new InvalidIdError()

    return user
  }
}
