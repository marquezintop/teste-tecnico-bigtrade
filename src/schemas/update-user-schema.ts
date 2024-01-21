import Joi from 'joi'

export const updateUserSchema = Joi.object({
  displayName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).or('displayName', 'email', 'password')
