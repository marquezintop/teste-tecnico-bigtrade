import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env' })

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
    console.log('Connected to the database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

export { connectToDatabase }
