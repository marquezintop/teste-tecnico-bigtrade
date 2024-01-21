import express from 'express'
import validateSchema from '../middlewares/validate-schema'
import AuthController from '../controllers/auth-controller'
import { createUserSchema } from '../schemas/create-user-schema'

const authRouter = express.Router()
const authController = new AuthController()

authRouter.use('/users', validateSchema(createUserSchema))

authRouter.post('/users', async (req, res) => {
  await authController.createUser(req, res)
})

export default authRouter
