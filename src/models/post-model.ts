/* eslint-disable @typescript-eslint/return-await */
import {
  Model, Schema, model,
} from 'mongoose'
import dayjs from 'dayjs'
import { PostCreateView, UpdatePostView, PostView } from '../interfaces/post-interface'

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

  public async create(post: PostCreateView) {
    const currentDate = new Date()
    return await this.model.create({
      ...post,
      published: dayjs(currentDate).toISOString(),
      updated: dayjs(currentDate).toISOString(),
    })
  }

  public async findAll() {
    return await this.model.find()
  }

  public async findById(id: string) {
    return await this.model.findById(id)
  }

  public async updateOne(id: string, post: UpdatePostView) {
    await this.model.updateOne(
      { _id: id },
      { $set: post },
    )
  }

  public async deleteOne(id: string) {
    await this.model.deleteOne({ _id: id })
  }

  public async deleteMany() {
    await this.model.deleteMany({})
  }
}
