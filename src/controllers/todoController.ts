import { Request, Response } from "express"
import prisma from "../lib/prisma"
import { AuthRequest } from "../middleware/authControllers"

// GET /api/todos
export const getTodos = async (req: AuthRequest, res: Response) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  })
  res.json(todos)
}

// GET /api/todos/:id
export const getTodoById = async (req: AuthRequest, res: Response) => {
  const todo = await prisma.todo.findFirst({
    where: { id: Number(req.params.id), userId: req.userId }
  })
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.json(todo)
}

// POST /api/todos
export const createTodo = async (req: AuthRequest, res: Response) => {
  const { title, userId } = req.body
  if (!title) {
    res.status(400).json({ message: 'title is required' })
    return
  }
  const todo = await prisma.todo.create({
    data: { title, userId: req.userId! }
  })
  res.status(201).json(todo)
}

// PATCH /api/todos/:id
export const updateTodo = async (req: AuthRequest, res: Response) => {
  const todo = await prisma.todo.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.done !== undefined && { done: req.body.done })
    }
  })
  res.json(todo)
}

// DELETE /api/todos/:id
export const deleteTodo = async (req: AuthRequest, res: Response) => {
  await prisma.todo.delete({
    where: { id: Number(req.params.id) }
  })
  res.status(204).send()
}