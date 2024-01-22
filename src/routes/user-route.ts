import { Request, Response, Router } from 'express'
import UserController from '../controllers/user-controller'
import validateSchema from '../middlewares/validate-schema'
import { createUserSchema } from '../schemas/create-user-schema'
import { updateUserSchema } from '../schemas/update-user-schema'

const userRouter = Router()
const userController = new UserController()

userRouter.post('/users', validateSchema(createUserSchema), (req: Request, res: Response) => userController.create(req, res))
userRouter.get('/users', (req: Request, res: Response) => userController.getAll(req, res))
userRouter.get('/users/:id', (req: Request, res: Response) => userController.getById(req, res))
userRouter.put('/users/:id', validateSchema(updateUserSchema), (req: Request, res: Response) => userController.updateById(req, res))
userRouter.delete('/users/:id', (req: Request, res: Response) => userController.deleteById(req, res))

export default userRouter
