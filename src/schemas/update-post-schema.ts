import Joi from 'joi'

export const updatePostSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
}).or('title', 'content')
