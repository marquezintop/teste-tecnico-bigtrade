import { Request, Response, Router } from 'express'
import validateSchema from '../middlewares/validate-schema'
import PostController from '../controllers/post-controller'
import { createPostSchema } from '../schemas/create-post-schema'

const postRouter = Router()
const postController = new PostController()

postRouter.post('/posts', validateSchema(createPostSchema), (req: Request, res: Response) => postController.create(req, res))

export default postRouter
