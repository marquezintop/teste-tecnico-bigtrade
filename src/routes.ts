import { Request, Response, Router } from 'express'
import UserModel from './models/user-model'
import UserService from './services/user-service'
import UserController from './controllers/user-controller'
import validateSchema from './middlewares/validate-schema'
import { createUserSchema } from './schemas/create-user-schema'
import { updateUserSchema } from './schemas/update-user-schema'
import PostModel from './models/post-model'
import PostService from './services/post-service'
import PostController from './controllers/post-controller'
import { createPostSchema } from './schemas/create-post-schema'
import { updatePostSchema } from './schemas/update-post-schema'

const userRouter = Router()
const postRouter = Router()

const userModel = new UserModel()
const userService = new UserService(userModel)
const userController = new UserController(userService)

const postModel = new PostModel()
const postService = new PostService(postModel, userService)
const postController = new PostController(postService)

// users routes
userRouter.post('/users', validateSchema(createUserSchema), (req: Request, res: Response) => userController.create(req, res))
userRouter.get('/users', (req: Request, res: Response) => userController.getAll(req, res))
userRouter.get('/users/:id', (req: Request, res: Response) => userController.getById(req, res))
userRouter.put('/users/:id', validateSchema(updateUserSchema), (req: Request, res: Response) => userController.updateById(req, res))
userRouter.delete('/users/:id', (req: Request, res: Response) => userController.deleteById(req, res))

// posts routes
postRouter.post('/posts', validateSchema(createPostSchema), (req: Request, res: Response) => postController.create(req, res))
postRouter.get('/posts', (req: Request, res: Response) => postController.getAll(req, res))
postRouter.get('/posts/:id', (req: Request, res: Response) => postController.getById(req, res))
postRouter.put('/posts/:id', validateSchema(updatePostSchema), (req: Request, res: Response) => postController.updateById(req, res))
postRouter.delete('/posts/:id', (req: Request, res: Response) => postController.deleteById(req, res))

export { userRouter, postRouter }
