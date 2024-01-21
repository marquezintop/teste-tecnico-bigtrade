import { Request, Response } from 'express'
import { EmailAlreadyUsedError } from '../errors/index'
import UserService from '../services/user-service'

export default class AuthController {
  constructor(
    private userService = new UserService(),
  ) {}

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req

      const user = await this.userService.postUser(body)

      return res.status(201).send(user)
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        return res.status(400).send({ error: error.message })
      }

      console.log(error)
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
