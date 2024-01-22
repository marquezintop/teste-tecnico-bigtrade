import {
  Model, Schema, model,
} from 'mongoose'
import { ObjectId } from 'mongodb'
import { UserView } from '../interfaces/user-interface'

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

  public create(user: UserView) {
    return this.model.create(user)
  }

  public findAll() {
    return this.model.find()
  }

  public findOneByEmail(email: string) {
    return this.model.findOne({ email })
  }

  public findById(id: ObjectId) {
    return this.model.findById(id)
  }

  public async updateOne(id: ObjectId, user: UserView) {
    await this.model.updateOne(
      { _id: id },
      { $set: user },
    )
  }

  public async deleteOne(id: ObjectId) {
    await this.model.deleteOne(id)
  }
}
