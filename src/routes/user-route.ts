import { Request, Response, Router } from 'express'
import UserController from '../controllers/user-controller'
import validateSchema from '../middlewares/validate-schema'
import { createUserSchema } from '../schemas/create-user-schema'

const userRouter = Router()
const userController = new UserController()

userRouter.post('/users', validateSchema(createUserSchema), (req: Request, res: Response) => userController.createUser(req, res))
userRouter.get('/users/:id', (req: Request, res: Response) => userController.getUserById(req, res))

export default userRouter
