import { Router } from "express"
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController'

const router = Router()

router.get('/', getTodos)
router.get('/:id', getTodoById)
router.post('/', createTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router
