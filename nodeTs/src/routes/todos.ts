import { Router } from 'express';

import { Todo } from '../models/todo';

type RequestBody = { text: string };
type RequestParams = { todoId: string };

let todos: Todo[] = [];

const router = Router();

router.get('/', (req: any, res: any, next: any) => {
  res.status(200).json({ todos: todos });
});

router.post('/todo', (req: any, res: any, next: any) => {
  const body = req.body as RequestBody;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Added Todo',
    todo: newTodo,
    todos: todos
  });
});

router.put('/todo/:todoId', (req: any, res: any, next: any) => {

  const params = req.params as RequestParams;
  const tid = params.todoId;
  const body = req.body as RequestBody;

  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
    return res.status(200).json({
      message: 'todo successfully updated',
      todos: todos
    });
  };

  res.status(404).json({ message: 'todo not found for id.' });
});

router.delete('/todo/:todoId', (req: any, res: any, next: any) => {
  const params = req.params as RequestParams;
  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({
    message: 'todo successfully deleted',
    todos: todos
  });
});

export default router;
