/* eslint-disable no-console */
import mongoose from 'mongoose'

interface ConnectionConfig {
  user: string;
  password: string;
  host: string;
  port: string;
}

const connectionConfig: ConnectionConfig = {
  user: process.env.MONGO_USER || '',
  password: process.env.MONGO_PASSWORD || '',
  host: process.env.MONGO_HOST || '',
  port: process.env.MONGO_PORT || '',
}

const {
  user, password, host, port,
} = connectionConfig

const dbName: string | undefined = process.env.MONGO_DB
const url: string = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(url)
    console.log('Connected to the database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

export { connectToDatabase }
