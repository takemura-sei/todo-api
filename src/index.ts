import 'dotenv/config'
import express from 'express'
import todosRouter from './routes/todos'
import authRouter from './routes/auth'
import { authenticate } from './middleware/authControllers'

const app = express()
const PORT = 3001

app.use(express.json())

// 認証不要
app.use('/api/auth', authRouter)

// 認証不要（authenticateミドルウェアを挟む）
app.use('/api/todos',authenticate ,todosRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})