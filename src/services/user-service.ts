import { isValidObjectId } from 'mongoose'
import { ObjectId } from 'mongodb'
import { EmailAlreadyUsedError, InvalidIdError } from '../errors/index'
import { User, UserView } from '../interfaces/user-interface'
import UserModel from '../models/user-model'

export default class UserService {
  constructor(
    private userModel = new UserModel(),
  ) {}

  public async create(createUserData: UserView): Promise<User> {
    const emailAlreadyInUse = await this.userModel.findOneByEmail(createUserData.email)

    if (emailAlreadyInUse) throw new EmailAlreadyUsedError()

    const userCreated = await this.userModel.create(createUserData)

    return userCreated
  }

  public async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll()

    return users
  }

  public async getById(id: string): Promise<User> {
    if (!isValidObjectId(id)) throw new InvalidIdError()

    const objectId = new ObjectId(id)

    const user = await this.userModel.findById(objectId)

    if (!user) throw new InvalidIdError()

    return user
  }

  public async updateById(id: string, updateUserData: UserView): Promise<User> {
    const objectId = new ObjectId(id)

    await this.userModel.updateOne(objectId, updateUserData)

    const user = await this.userModel.findById(objectId)

    if (!user) throw new InvalidIdError()

    return user
  }

  public async deleteById(id: string) {
    const objectId = new ObjectId(id)

    await this.userModel.deleteOne(objectId)
  }
}
