import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export default function validateSchema(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false })

    if (validation.error) {
      const errors = validation.error.details.map((d) => d.message)
      return res.status(422).send(errors)
    }

    return next()
  }
}
