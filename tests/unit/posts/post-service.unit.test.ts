/* eslint-disable no-underscore-dangle */
import { PostNotFoundError, UserNotFoundError } from '../../../src/errors'
import { postCreateData } from '../../helpers/post-data'
import { stringIdData } from '../../helpers/shared-data'
import { cleanDb, connectToDatabase, disconnectFromDatabase } from '../../config/connection-test-db'
import { userCreateData } from '../../helpers/user-data'
import { postModel, postService, userModel } from '../../config/initialize-classes'

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('post service create method', () => {
  it('should return an error if the userId is not a valid id', async () => {
    try {
      await postService.create({ ...postCreateData, userId: stringIdData })
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError)
    }
  })

  it('should return the created post with accurate details', async () => {
    const createdUser = await userModel.create(userCreateData)
    const result = await postService.create({ ...postCreateData, userId: createdUser._id.toString() })

    expect(result.title).toBe(postCreateData.title)
    expect(result.content).toBe(postCreateData.content)
  })
})

describe('post service findAll method', () => {
  it('should return empty array if there are no posts', async () => {
    const result = await postService.findAll()

    expect(result).toHaveLength(0)
  })

  it('should return an array of posts if there are posts', async () => {
    const createdUser = await userModel.create(userCreateData)
    await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    const result = await postService.findAll()

    expect(result).toHaveLength(1)
  })
})

describe('user service findById method', () => {
  it('should return an error if the id is invalid', async () => {
    try {
      await postService.findById('a')
    } catch (error) {
      expect(error?.constructor.name).toBe('CastError')
    }
  })

  it('should return an error if the id is not associated with a post', async () => {
    try {
      await postService.findById(stringIdData)
    } catch (error) {
      expect(error).toBeInstanceOf(PostNotFoundError)
    }
  })

  it('should return the user associated with the id', async () => {
    const createdUser = await userModel.create(userCreateData)
    const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
    const result = await postService.findById(createdPost._id.toString())

    expect(result.title).toEqual(createdPost.title)
    expect(result.content).toEqual(createdPost.content)
  })

  describe('post service updateById method', () => {
    it('should return an error if the id is invalid or not associated with a post', async () => {
      try {
        await postService.updateById(stringIdData, { title: 'Test' })
      } catch (error) {
        expect(error).toBeInstanceOf(PostNotFoundError)
      }
    })

    it('should return the post updated', async () => {
      const createdUser = await userModel.create(userCreateData)
      const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
      const result = await postService.updateById(createdPost._id.toString(), { title: 'Test' })

      expect(result.title).toEqual('Test')
    })
  })

  describe('post service deleteById method', () => {
    it('should return undefined if post is deleted', async () => {
      const createdUser = await userModel.create(userCreateData)
      const createdPost = await postModel.create({ ...postCreateData, userId: createdUser._id.toString() })
      const result = await postService.deleteById(createdPost._id.toString())

      expect(result).toBeUndefined()
    })
  })
})
