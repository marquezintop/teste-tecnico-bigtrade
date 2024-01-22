import { Request, Response } from 'express'
import { EmailAlreadyUsedError, UserNotFoundError } from '../errors/index'
import UserService from '../services/user-service'

export default class UserController {
  constructor(
    private userService : UserService,
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req

      const user = await this.userService.create(body)

      return res.status(201).send(user)
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        return res.status(400).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.findAll()

      return res.status(200).send(users)
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      await this.userService.verifyUserExistenceById(id)

      const user = await this.userService.findById(id)

      return res.status(200).send(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async updateById(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req
      const { id } = req.params

      await this.userService.verifyUserExistenceById(id)

      const user = await this.userService.updateById(id, body)

      return res.status(200).send(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async deleteById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      await this.userService.verifyUserExistenceById(id)

      await this.userService.deleteById(id)

      return res.sendStatus(200)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
