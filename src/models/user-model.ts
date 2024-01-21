/* eslint-disable @typescript-eslint/return-await */
import {
  Model, Schema, model,
} from 'mongoose'
import { ObjectId } from 'mongodb'
import { PublicUser, UserView } from '../interfaces/user-interface'

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

  public getUserByEmail(email: string): Promise<PublicUser | null> {
    return this.model.findOne({ email })
  }

  public getUserById(id: ObjectId): Promise<PublicUser | null> {
    return this.model.findById(id)
  }

  public createUser(user: UserView): Promise<PublicUser> {
    return this.model.create(user)
  }

  public async putUserById(id: ObjectId, user: UserView) {
    await this.model.updateOne(
      { _id: id },
      { $set: user },
    )
  }
}
