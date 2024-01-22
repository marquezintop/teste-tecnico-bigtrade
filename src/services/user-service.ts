import { isValidObjectId } from 'mongoose'
import { EmailAlreadyUsedError, UserNotFoundError } from '../errors/index'
import { UpdateUserView, User, UserView } from '../interfaces/user-interface'
import UserModel from '../models/user-model'

export default class UserService {
  constructor(
    private userModel: UserModel,
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

  public async verifyUserExistenceById(id: string) {
    if (!isValidObjectId(id)) throw new UserNotFoundError()

    const user = await this.userModel.findById(id)

    if (!user) throw new UserNotFoundError()
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id)

    if (!user) throw new UserNotFoundError()

    return user
  }

  public async updateById(id: string, updateUserData: UpdateUserView): Promise<User | null> {
    await this.userModel.updateOne(id, updateUserData)

    const user = await this.userModel.findById(id)

    return user
  }

  public async deleteById(id: string) {
    await this.userModel.deleteOne(id)
  }
}
