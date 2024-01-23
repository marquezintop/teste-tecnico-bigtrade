/* eslint-disable no-underscore-dangle */
import supertest from 'supertest'
import { app } from '../../src/app'
import { cleanDb, connectToDatabase, disconnectFromDatabase } from '../config/connection-test-db'
import { userCreateData } from '../helpers/user-data'
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

describe('POST /users', () => {
  it('should respond with status 422 if body has invalid data', async () => {
    const result = await server.post('/users')

    const { statusCode, body } = result
    expect(statusCode).toBe(422)
    expect(body).toStrictEqual(['"displayName" is required', '"email" is required', '"password" is required'])
  })

  it('should respond with status 400 if email is already used', async () => {
    await server.post('/users').send({ ...userCreateData, email: 'test@example.com' })
    const result = await server.post('/users').send({ ...userCreateData, email: 'test@example.com' })

    const { statusCode, body } = result
    expect(statusCode).toBe(400)
    expect(body.error).toBe(
      'The provided email address is already in use. Please use a different email address.',
    )
  })

  it('should respond with status 201 if user is created', async () => {
    const result = await server.post('/users').send(userCreateData)

    const { statusCode, body } = result
    expect(statusCode).toBe(201)
    expect(body.displayName).toBe(userCreateData.displayName)
    expect(body.email).toBe(userCreateData.email)
  })
})

describe('GET /users', () => {
  it('should respond with status 200 and empty array if there is no users', async () => {
    const result = await server.get('/users')

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body).toEqual([])
  })

  it('should respond with status 200 and array with users created', async () => {
    await server.post('/users').send(userCreateData)
    const result = await server.get('/users')

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body).toHaveLength(1)
    expect(body).toEqual(expect.arrayContaining([expect.objectContaining(userCreateData)]))
  })
})

describe('GET /users/:id', () => {
  it('should respond with status 404 if the id is either invalid or not associated within a user', async () => {
    const result = await server.get(`/users/${stringIdData}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('User not found. The provided user ID is either invalid or does not exist.')
  })

  it('should respond with status 200 and user associated with the id', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const result = await server.get(`/users/${userCreated.body._id.toString()}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body.displayName).toBe(userCreateData.displayName)
    expect(body.email).toBe(userCreateData.email)
  })
})

describe('PUT /users/:id', () => {
  it('should respond with status 422 if body has invalid data', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const result = await server.put(`/users/${userCreated.body._id.toString()}`).send()

    const { statusCode, body } = result
    expect(statusCode).toBe(422)
    expect(body).toEqual(['"value" must contain at least one of [displayName, email, password]'])
  })

  it('should respond with status 404 if the id is either invalid or not associated within a user', async () => {
    const result = await server.put(`/users/${stringIdData}`).send({ displayName: 'Matheus' })

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('User not found. The provided user ID is either invalid or does not exist.')
  })

  it('should respond with status 200 and user updated', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const result = await server.put(`/users/${userCreated.body._id.toString()}`).send({ displayName: 'Matheus' })

    const { statusCode, body } = result
    expect(statusCode).toBe(200)
    expect(body.displayName).toBe('Matheus')
  })
})

describe('DELETE /users/:id', () => {
  it('should respond with status 404 if the id is either invalid or not associated within a user', async () => {
    const result = await server.delete(`/users/${stringIdData}`)

    const { statusCode, body } = result
    expect(statusCode).toBe(404)
    expect(body.error).toEqual('User not found. The provided user ID is either invalid or does not exist.')
  })

  it('should respond with status 200 if user is deleted', async () => {
    const userCreated = await server.post('/users').send(userCreateData)
    const result = await server.delete(`/users/${userCreated.body._id.toString()}`)

    const { statusCode } = result
    expect(statusCode).toBe(200)
  })
})
