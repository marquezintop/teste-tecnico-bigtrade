import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(url)
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.connection.close()
    await mongoose.deleteModel('users')
    await mongoose.deleteModel('posts')
  } catch (error) {
    console.error('Error disconnecting from the database:', error)
  }
}

async function cleanDb(): Promise<void> {
  try {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('posts').deleteMany({})
  } catch (error) {
    console.error('Error cleaning collections from the database:', error)
  }
}

export {
  connectToDatabase,
  disconnectFromDatabase,
  cleanDb,
}
