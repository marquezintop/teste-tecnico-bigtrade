import {
  Model, Schema, model,
} from 'mongoose'
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { PostCreateView, PostUpdateView, PostView } from '../interfaces/post-interface'

export default class PostModel {
  private schema: Schema

  private model: Model<PostView>

  constructor() {
    this.schema = new Schema<PostView>(
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        userId: {
          type: String,
          required: true,
        },
        published: {
          type: String,
          required: true,
        },
        updated: {
          type: String,
          required: true,
        },
      },
    )

    this.model = model<PostView>('posts', this.schema)
  }

  public create(post: PostCreateView) {
    const currentDate = new Date()
    return this.model.create({
      ...post,
      published: dayjs(currentDate).toISOString(),
      updated: dayjs(currentDate).toISOString(),
    })
  }

  public findAll() {
    return this.model.find()
  }

  public findById(id: ObjectId) {
    return this.model.findById(id)
  }

  public async updateOne(id: ObjectId, post: PostUpdateView) {
    await this.model.updateOne(
      { _id: id },
      { $set: post },
    )
  }

  public async deleteOne(id: ObjectId) {
    await this.model.deleteOne(id)
  }
}
