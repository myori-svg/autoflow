import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './services/db'
import aiRouter from './routes/ai'
import feedbackRouter from './routes/feedback'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/ai', aiRouter)
app.use('/api/feedback', feedbackRouter)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
