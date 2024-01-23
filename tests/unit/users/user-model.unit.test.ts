/* eslint-disable no-underscore-dangle */
import { stringIdData } from '../../helpers/shared-data'
import {
  cleanDb,
  connectToDatabase, disconnectFromDatabase,
} from '../../config/connection-test-db'
import { userCreateData } from '../../helpers/user-data'
import { userModel } from '../../config/initialize-classes'

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('user model create method', () => {
  it('should return the created user with accurate details', async () => {
    const result = await userModel.create(userCreateData)

    expect(result.displayName).toEqual(userCreateData.displayName)
    expect(result.email).toEqual(userCreateData.email)
  })
})

describe('user model findAll method', () => {
  it('should return empty array if there are no users', async () => {
    const result = await userModel.findAll()

    expect(result).toHaveLength(0)
  })

  it('should return an array of users if there are users', async () => {
    await userModel.create(userCreateData)
    const result = await userModel.findAll()

    expect(result).toHaveLength(1)
  })
})

describe('user model findOneByEmail method', () => {
  it('should return null if there are no users associated with this email', async () => {
    const result = await userModel.findOneByEmail('example@gmail.com')

    expect(result).toBeNull()
  })

  it('should return the user associated with the email', async () => {
    const userCreated = await userModel.create(userCreateData)
    const result = await userModel.findOneByEmail(userCreated.email)

    expect(result?.displayName).toEqual(userCreateData.displayName)
    expect(result?.email).toEqual(userCreateData.email)
  })
})

describe('user model findById method', () => {
  it('should return null if there are no users associated with this id', async () => {
    const result = await userModel.findById(stringIdData)

    expect(result).toBeNull()
  })

  it('should return the user associated with the id', async () => {
    const userCreated = await userModel.create(userCreateData)
    const result = await userModel.findById(userCreated._id.toString())

    expect(result?.displayName).toEqual(userCreateData.displayName)
    expect(result?.email).toEqual(userCreateData.email)
  })
})

describe('user model updateOne method', () => {
  it('should return the user updated', async () => {
    const userCreated = await userModel.create(userCreateData)
    await userModel.updateOne(userCreated._id.toString(), { displayName: 'Matheus' })
    const updatedUser = await userModel.findById(userCreated._id.toString())

    expect(updatedUser?.displayName).toEqual('Matheus')
  })
})

describe('user model deleteOne method', () => {
  it('should return the null if the user is deleted', async () => {
    const userCreated = await userModel.create(userCreateData)
    await userModel.deleteOne(userCreated._id.toString())
    const deletedUser = await userModel.findById(userCreated._id.toString())

    expect(deletedUser).toBeNull()
  })
})
