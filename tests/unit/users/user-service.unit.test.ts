/* eslint-disable no-underscore-dangle */
import { EmailAlreadyUsedError, UserNotFoundError } from '../../../src/errors'
import { stringIdData } from '../../helpers/shared-data'
import { cleanDb, connectToDatabase, disconnectFromDatabase } from '../../config/connection-test-db'
import { userCreateData } from '../../helpers/user-data'
import { userModel, userService } from '../../config/initialize-classes'

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('user service create method', () => {
  it('should return the created user with accurate details', async () => {
    const result = await userService.create(userCreateData)

    expect(result.displayName).toEqual(userCreateData.displayName)
    expect(result.email).toEqual(userCreateData.email)
  })

  it('should return an error if the create user is trying to use a email already used', async () => {
    try {
      const createdUser = await userModel.create(userCreateData)
      await userService.create({
        displayName: 'Matheus',
        email: createdUser.email,
        password: '123456',
      })
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAlreadyUsedError)
    }
  })
})

describe('user service findAll method', () => {
  it('should return empty array if there are no users', async () => {
    const result = await userService.findAll()

    expect(result).toHaveLength(0)
  })

  it('should return an array of users if there are users', async () => {
    await userModel.create(userCreateData)
    const result = await userService.findAll()

    expect(result).toHaveLength(1)
  })
})

describe('user service verifyUserExistenceById method', () => {
  it('should return an error if the id is not a valid objectId', async () => {
    try {
      await userService.verifyUserExistenceById('1')
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError)
    }
  })

  it('should return an error if the id is not associated with any user', async () => {
    try {
      await userService.verifyUserExistenceById(stringIdData)
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError)
    }
  })

  it('shoud return undefined if the id is a valid and associated ObjectId', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await userService.verifyUserExistenceById(createdUser._id.toString())

    expect(result).toBeUndefined()
  })
})

describe('user service findById method', () => {
  it('should return an error if the id is invalid', async () => {
    try {
      await userService.findById('a')
    } catch (error) {
      expect(error?.constructor.name).toBe('CastError')
    }
  })

  it('should return an error if the id is not associated with a user', async () => {
    try {
      await userService.findById(stringIdData)
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError)
    }
  })

  it('should return the user associated with the id', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await userService.findById(createdUser._id.toString())

    expect(result.displayName).toEqual(createdUser.displayName)
    expect(result.email).toEqual(userCreateData.email)
  })
})

describe('user service updateById method', () => {
  it('should return an error if the id is invalid or not associated with a user', async () => {
    try {
      await userService.updateById(stringIdData, { displayName: 'Matheus' })
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError)
    }
  })

  it('should return the user updated', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await userService.updateById(createdUser._id.toString(), { displayName: 'Matheus' })

    expect(result?.displayName).toEqual('Matheus')
  })
})

describe('user service deleteById method', () => {
  it('should return undefined if user is deleted', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await userService.deleteById(createdUser._id.toString())

    expect(result).toBeUndefined()
  })
})
