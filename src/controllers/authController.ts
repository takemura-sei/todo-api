import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET!

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email ||  !password) {
    res.status(400).json({ message: 'email と password は必須です' })
    return
  } 

  // パスワードをハッシュ化（生のパスワードはDBに保存しない）
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  })

  res.status(201).json({ message: '登録完了', userId: user.id })
}

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ message: 'メールアドレスまたはパスワードが違います' })
    return
  }

  // 入力パスワードとハッシュを比較
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    res.status(401).json({ messge: 'メールアドレスまたはパスワードが違います' })
    return
  }

  // JWTトークン発行（有効期限7日）
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ token })
}