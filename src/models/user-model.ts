/* eslint-disable @typescript-eslint/return-await */
import {
  Model, Schema, model,
} from 'mongoose'
import { UpdateUserView, UserView } from '../interfaces/user-interface'

export default class UserModel {
  private schema: Schema

  private model: Model<UserView>

  constructor() {
    this.schema = new Schema<UserView>(
      {
        displayName: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    )

    this.model = model<UserView>('users', this.schema)
  }

  public async create(user: UserView) {
    return await this.model.create(user)
  }

  public async findAll() {
    return await this.model.find()
  }

  public async findOneByEmail(email: string) {
    return await this.model.findOne({ email })
  }

  public async findById(id: string) {
    return await this.model.findById(id)
  }

  public async updateOne(id: string, user: UpdateUserView) {
    await this.model.updateOne(
      { _id: id },
      { $set: user },
    )
  }

  public async deleteOne(id: string) {
    await this.model.deleteOne({ _id: id })
  }
}
