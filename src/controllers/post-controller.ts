import { Request, Response } from 'express'
import { PostNotFoundError, UserNotFoundError } from '../errors'
import PostService from '../services/post-service'

export default class PostController {
  constructor(
    private postService: PostService,
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req

      const post = await this.postService.create(body)

      return res.status(201).send(post)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await this.postService.findAll()

      return res.status(200).send(posts)
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      await this.postService.verifyPostExistenceById(id)

      const post = await this.postService.findById(id)

      return res.status(200).send(post)
    } catch (error) {
      if (error instanceof PostNotFoundError) {
        return res.status(404).send({ error: error.message })
      }

      return res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
