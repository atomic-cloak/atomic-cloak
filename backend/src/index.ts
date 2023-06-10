import express, { type Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import appRouter from './routes'
import { errorHandler } from './errors/errorHandler'

const main = async () => {
  dotenv.config()

  const app: Express = express()

  app.use(cors())
  app.use(express.json())

  app.use('/api/v1', appRouter)

  app.use(errorHandler)

  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
  })
}

main().catch((e) => {
  console.error(e)
})
