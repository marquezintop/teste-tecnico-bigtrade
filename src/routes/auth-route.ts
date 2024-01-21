import express from 'express'
import validateSchema from '../middlewares/validate-schema'
import AuthController from '../controllers/auth-controller'
import { createUserSchema } from '../schemas/create-user-schema'

const authRouter = express.Router()
const authController = new AuthController()

authRouter.use('/v1/auth', validateSchema(createUserSchema))

authRouter.post('/v1/auth', async (req, res) => {
  await authController.createUser(req, res)
})

export default authRouter
