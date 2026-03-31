import { Request, Response } from "express";
import prisma from "../lib/prisma";

// GET /api/todos
export const getTodos = async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json(todos)
}

// GET /api/todos/:id
export const getTodoById = async (req: Request, res: Response) => {
  const todo = await prisma.todo.findUnique({
    where: { id: Number(req.params.id) }
  })
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.json(todo)
}

// POST /api/todos
export const createTodo = async (req: Request, res: Response) => {
  const { title, userId } = req.body
  if (!title) {
    res.status(400).json({ message: 'title is required' })
    return
  }
  if (!userId) {
    res.status(400).json({ message: 'userId is required' })
    return
  }
  const todo = await prisma.todo.create({
    data: { title, userId: Number(userId) }
  })
  res.status(201).json(todo)
}

// PATCH /api/todos/:id
export const updateTodo = async (req: Request, res: Response) => {
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
export const deleteTodo = async (req: Request, res: Response) => {
  await prisma.todo.delete({
    where: { id: Number(req.params.id) }
  })
  res.status(204).send()
}