import Joi from 'joi'

export const createUserSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
})
