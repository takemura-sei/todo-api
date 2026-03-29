import { Request, response, Response } from "express";

let todos = [
  { id: 1, title: '買い物', done: false },
  { id: 2, title: '勉強', done: false },
]

// GET /api/todos
export const getTodos = (req: Request, res: Response) => {
  res.json(todos)
}

// GET /api/todos/:id
export const getTodoById = (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.json(todo)
}

// POST /api/todos
export const createTodo = (req: Request, res: Response) => {
  const { title } = req.body
  if (!title) {
    res.status(400).json({ message: 'title is required' })
    return
  }
  const newTodo = { id: Date.now(), title, done: false }
  todos.push(newTodo)
  res.status(201).json(newTodo)
}

// PATCH /api/todos/:id
export const updateTodo = (req: Request, res: Response) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  if (req.body.title !== undefined) todo.title = req.body.title
  if (req.body.done !== undefined) todo.done = req.body.done
  res.json(todo)
}

// DELETE /api/todos/:id
export const deleteTodo = (req: Request, res: Response) => {
  todos = todos.filter(t => t.id !== Number(req.params.id))
  res.status(204).send()
}