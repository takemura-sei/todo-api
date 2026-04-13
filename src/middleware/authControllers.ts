import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

// Requestの型を拡張してuseIdを追加
export interface AuthRequest extends Request {
  userId?: number
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  // "Bearer <token>" の形式で来る
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: '認証トークンがありません' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ message: 'トークンが無効です' })
  }
}