import express from 'express'
import { connectToDatabase } from './config/connection'
import { postRouter, userRouter } from './routes'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use(userRouter)
app.use(postRouter)

connectToDatabase()

const server = app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
))

export default server
