import express from 'express'
import { connectToDatabase } from './config/connection'
import authRouter from './routes/auth-route'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use(authRouter)

connectToDatabase()

const server = app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
))

export default server
