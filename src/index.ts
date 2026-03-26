import express from 'express'
import { listen } from 'node:quic'

const app = express()
const PORT = 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Todo API!'})
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})