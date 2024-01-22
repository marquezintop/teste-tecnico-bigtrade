import { isValidObjectId } from 'mongoose'
import { Post, PostCreateView, UpdatePostView } from '../interfaces/post-interface'
import PostModel from '../models/post-model'
import UserService from './user-service'
import { PostNotFoundError } from '../errors'

export default class PostService {
  constructor(
    private postModel: PostModel,
    private userService: UserService,
  ) {}

  public async create(createPostData: PostCreateView): Promise<Post> {
    await this.userService.verifyUserExistenceById(createPostData.userId)

    const postCreated = await this.postModel.create(createPostData)

    return postCreated
  }

  public async findAll(): Promise<Post[]> {
    const posts = await this.postModel.findAll()

    return posts
  }

  public async verifyPostExistenceById(id: string) {
    if (!isValidObjectId(id)) throw new PostNotFoundError()

    const post = await this.postModel.findById(id)

    if (!post) throw new PostNotFoundError()
  }

  public async findById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id)

    if (!post) throw new PostNotFoundError()

    return post
  }

  public async updateById(id: string, updatePostData: UpdatePostView): Promise<Post> {
    await this.postModel.updateOne(id, updatePostData)

    const postUpdated = await this.postModel.findById(id)

    if (!postUpdated) throw new PostNotFoundError()

    return postUpdated
  }

  public async deleteById(id: string) {
    await this.postModel.deleteOne(id)
  }
}
