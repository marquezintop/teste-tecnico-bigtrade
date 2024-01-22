import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors'
import PostService from '../services/post-service'

export default class PostController {
  constructor(
    private postService: PostService,
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req

      const user = await this.postService.create(body)

      return res.status(201).send(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
