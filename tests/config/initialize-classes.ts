import UserModel from '../../src/models/user-model'
import PostModel from '../../src/models/post-model'
import UserService from '../../src/services/user-service'
import PostService from '../../src/services/post-service'

export const userModel = new UserModel()
export const postModel = new PostModel()
export const userService = new UserService(userModel)
export const postService = new PostService(postModel, userService)
