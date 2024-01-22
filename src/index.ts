import express from 'express'
import { connectToDatabase } from './config/connection'
import userRouter from './routes/user-route'
import postRouter from './routes/post-route'

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
