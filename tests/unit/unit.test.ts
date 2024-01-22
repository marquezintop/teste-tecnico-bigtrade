/* eslint-disable no-underscore-dangle */
import { EmailAlreadyUsedError, PostNotFoundError, UserNotFoundError } from '../../src/errors'
import { postCreateData } from '../helpers/post-data'
import { stringIdData } from '../helpers/shared-data'
import {
  cleanDb,
  connectToDatabase, disconnectFromDatabase, postModel, postService, userModel, userService,
} from '../helpers/test-db'
import { userCreateData } from '../helpers/user-data'

beforeAll(async () => {
  await connectToDatabase()
})

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await disconnectFromDatabase()
})

describe('user model methods', () => {
  describe('user model create method', () => {
    it('should return the created user with accurate details', async () => {
      const result = await userModel.create(userCreateData)
      console.log(result)

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
      const user = await userModel.create(userCreateData)
      console.log(user)
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
      console.log(updatedUser)

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
})

describe('user service methods', () => {
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
})

describe('post service methods', () => {
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
})

describe('post model methods', () => {
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
      console.log(updatedPost)

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
})
