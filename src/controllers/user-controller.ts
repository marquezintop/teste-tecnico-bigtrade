import { Request, Response } from 'express'
import { EmailAlreadyUsedError, InvalidIdError } from '../errors/index'
import UserService from '../services/user-service'

export default class UserController {
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

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const user = await this.userService.findUserById(id)

      return res.status(200).send(user)
    } catch (error) {
      if (error instanceof InvalidIdError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
