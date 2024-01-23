/* eslint-disable no-underscore-dangle */
import supertest from 'supertest'
import { app } from '../../src/app'
import { cleanDb, connectToDatabase, disconnectFromDatabase } from '../config/connection-test-db'
import { userCreateData } from '../helpers/user-data'
import { postCreateData } from '../helpers/post-data'
import { stringIdData } from '../helpers/shared-data'

const server = supertest(app)

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('POST /posts', () => {
  it('should respond with status 422 if body has invalid data', async () => {
    const result = await server.post('/posts')

    const { statusCode, body } = result
    expect(statusCode).toBe(422)
    expect(body).toStrictEqual(['"title" is required', '"content" is required', '"userId" is required'])
  })

  it('should respond with status 404 if userId is invalid or not associated within a user', async () => {
    const result = await server.post('/posts').send({ ...postCreateData, userId: stringIdData })

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toBe(
      'User not found. The provided user ID is either invalid or does not exist.',
    )
  })

  it('should respond with status 201 if post is created', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const result = await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })

    const { statusCode, body } = result
    expect(statusCode).toBe(201)
    expect(body.title).toBe(postCreateData.title)
    expect(body.content).toBe(postCreateData.content)
  })
})

describe('GET /posts', () => {
  it('should respond with status 200 and empty array if there is no posts', async () => {
    const result = await server.get('/posts')

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body).toEqual([])
  })

  it('should respond with status 200 and array with posts created', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })
    const result = await server.get('/posts')

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body).toHaveLength(1)
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining(postCreateData)]))
  })
})

describe('GET /posts/:id', () => {
  it('should respond with status 404 if the id is either invalid or not associated within a post', async () => {
    const result = await server.get(`/posts/${stringIdData}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('Post not found. The provided post ID is either invalid or does not exist.')
  })

  it('should respond with status 200 and post associated with the id', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const postCreated = await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })
    const result = await server.get(`/posts/${postCreated.body._id.toString()}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body.title).toBe(postCreateData.title)
    expect(body.content).toBe(postCreateData.content)
  })
})

describe('PUT /posts/:id', () => {
  it('should respond with status 422 if body has invalid data', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const postCreated = await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })
    const result = await server.put(`/posts/${postCreated.body._id.toString()}`).send()

    const { statusCode, body } = result
    expect(statusCode).toBe(422)
    expect(body).toEqual(['"value" must contain at least one of [title, content]'])
  })

  it('should respond with status 404 if the id is either invalid or not associated within a user', async () => {
    const result = await server.put(`/posts/${stringIdData}`).send({ title: 'Test' })

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('Post not found. The provided post ID is either invalid or does not exist.')
  })

  it('should respond with status 200 and user updated', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const postCreated = await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })
    const result = await server.put(`/posts/${postCreated.body._id.toString()}`).send({ title: 'Test' })

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body.title).toBe('Test')
  })
})

describe('DELETE /posts/:id', () => {
  it('should respond with status 404 if the id is either invalid or not associated within a post', async () => {
    const result = await server.delete(`/posts/${stringIdData}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('Post not found. The provided post ID is either invalid or does not exist.')
  })

  it('should respond with status 200 if post is deleted', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const postCreated = await server.post('/posts').send({
      ...postCreateData,
      userId: userCreated.body._id.toString(),
    })
    const result = await server.delete(`/posts/${postCreated.body._id.toString()}`)

    const { statusCode } = result
    expect(statusCode).toBe(200)
  })
})
