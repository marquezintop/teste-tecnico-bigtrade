import { Post, PostCreateView } from '../interfaces/post-interface'
import PostModel from '../models/post-model'
import UserService from './user-service'

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
}
