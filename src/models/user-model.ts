/* eslint-disable @typescript-eslint/return-await */
import {
  Model, Schema, model,
} from 'mongoose'
import { ObjectId } from 'mongodb'
import { PublicUser, UserView } from '../interfaces/user-interface'
import { hash } from '../utils/hash'

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
      {
        toJSON: {
          transform(doc, ret) {
            delete ret.password
          },
        },
      },
    )

    this.model = model<UserView>('users', this.schema)
  }

  public getUserByEmail(email: string): Promise<PublicUser | null> {
    return this.model.findOne({ email })
  }

  public async getUserById(id: ObjectId): Promise<PublicUser | null> {
    return this.model.findById(id)
  }

  public createUser(user: UserView): Promise<PublicUser> {
    return this.model.create({ ...user, password: hash(user.password) })
  }
}
