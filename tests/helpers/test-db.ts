import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserModel from '../../src/models/user-model'
import PostModel from '../../src/models/post-model'
import UserService from '../../src/services/user-service'
import PostService from '../../src/services/post-service'

dotenv.config({ path: '.env.test' })

interface ConnectionConfig {
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
}

const connectionConfig: ConnectionConfig = {
  user: process.env.MONGO_USER || '',
  password: process.env.MONGO_PASSWORD || '',
  host: process.env.MONGO_HOST || '',
  port: process.env.MONGO_PORT || '',
  dbName: process.env.MONGO_DB || '',
}

const {
  user, password, host, port, dbName,
} = connectionConfig

const url: string = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`

const userModel = new UserModel()
const postModel = new PostModel()
const userService = new UserService(userModel)
const postService = new PostService(postModel, userService)

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(url)
    console.log('Connected to the database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.connection.close()
    console.log('Disconnected from the database')
  } catch (error) {
    console.error('Error disconnecting from the database:', error)
  }
}

async function cleanDb(): Promise<void> {
  try {
    await userModel.deleteMany()
    await postModel.deleteMany()
    console.log('DB cleaned')
  } catch (error) {
    console.error('Error cleaning collections from the database:', error)
  }
}

export {
  connectToDatabase,
  disconnectFromDatabase,
  cleanDb,
  userModel,
  postModel,
  userService,
  postService,
}
