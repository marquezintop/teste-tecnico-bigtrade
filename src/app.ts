import express from 'express'
import { postRouter, userRouter } from './routes'

const app = express()

app.use(express.json())

app.use(userRouter)
app.use(postRouter)

export { app }
