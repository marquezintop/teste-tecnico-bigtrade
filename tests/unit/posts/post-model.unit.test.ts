/* eslint-disable no-underscore-dangle */
import { postCreateData } from '../../helpers/post-data'
import { stringIdData } from '../../helpers/shared-data'
import { cleanDb, connectToDatabase, disconnectFromDatabase } from '../../config/connection-test-db'
import { userCreateData } from '../../helpers/user-data'
import { postModel, userModel } from '../../config/initialize-classes'

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('post model create method', () => {
  it('should return the created post with the accurate details', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })

    expect(result.title).toBe(postCreateData.title)
    expect(result.content).toBe(postCreateData.content)
  })
})

describe('post model findAll method', () => {
  it('should return empty array if there are no posts', async () => {
    const result = await postModel.findAll()

    expect(result).toHaveLength(0)
  })

  it('should return an array of posts if there are posts', async () => {
    const createdUser = await userModel.create(userCreateData)
    await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    const result = await userModel.findAll()

    expect(result).toHaveLength(1)
  })
})

describe('post model findById method', () => {
  it('should return null if there are no posts associated with this id', async () => {
    const result = await postModel.findById(stringIdData)

    expect(result).toBeNull()
  })

  it('should return the post associated with the id', async () => {
    const createdUser = await userModel.create(userCreateData)
    const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    const result = await postModel.findById(createdPost._id.toString())

    expect(result?.title).toEqual(createdPost.title)
    expect(result?.content).toEqual(createdPost.content)
  })
})

describe('post model updateOne method', () => {
  it('should return the post updated', async () => {
    const createdUser = await userModel.create(userCreateData)
    const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    await postModel.updateOne(createdPost._id.toString(), { title: 'Test' })
    const updatedPost = await postModel.findById(createdPost._id.toString())

    expect(updatedPost?.title).toEqual('Test')
  })
})

describe('post model deleteOne method', () => {
  it('should return null if the post is deleted', async () => {
    const createdUser = await userModel.create(userCreateData)
    const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    await postModel.deleteOne(createdPost._id.toString())
    const deletedPost = await userModel.findById(createdPost._id.toString())

    expect(deletedPost).toBeNull()
  })
})
