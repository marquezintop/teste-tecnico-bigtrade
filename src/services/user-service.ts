import { isValidObjectId } from 'mongoose'
import { ObjectId } from 'mongodb'
import { EmailAlreadyUsedError, InvalidIdError } from '../errors/index'
import { PublicUser, UserView } from '../interfaces/user-interface'
import UserModel from '../models/user-model'

export default class UserService {
  constructor(
    private userModel = new UserModel(),
  ) {}

  public async postUser(createUserData: UserView): Promise<PublicUser> {
    const emailAlreadyInUse = await this.userModel.getUserByEmail(createUserData.email)

    if (emailAlreadyInUse) throw new EmailAlreadyUsedError()

    const userCreated = await this.userModel.createUser(createUserData)

    return userCreated
  }

  public async findUserById(id: string): Promise<PublicUser> {
    if (!isValidObjectId(id)) throw new InvalidIdError()

    const objectId = new ObjectId(id)

    const user = await this.userModel.getUserById(objectId)

    if (!user) throw new InvalidIdError()

    return user
  }

  public async updateUserById(id: string, updateUserData: UserView) {
    const objectId = new ObjectId(id)

    try {
      await this.userModel.putUserById(objectId, updateUserData)
      // Faça algo com updatedUser
    } catch (error) {
      console.error(`Error updating user: ${error}`)
      // Lide com o erro
    }

    const user = await this.userModel.getUserById(objectId)

    return user
  }
}
