import { Router, Request, Response, NextFunction } from 'express';

import { getEventById, getEventsByUser, createEvent } from 'controllers/events';

import { IEvent } from 'models/event';
import { mockEvents } from 'utils/mockData/events';

const events: IEvent[] = [...mockEvents];

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(events);
});

router.get('/:eventId', getEventById);
router.get('/user/:userId', getEventsByUser);

router.post('/', createEvent);

// router.put('todo/:todoId', (req, res, next) => {
//   const { todoId } = req.params;
//   const todoIndex = todos.findIndex(item => item.id === todoId);
//   if (todoIndex > -1) {
//     todos[todoIndex] = { id: todoId, text: req.body.text };
//     return res.status(200).json({ ...todos[todoIndex] });
//   }

//   res.status(404).json({ message: 'Could not find todo for this id.' });
// });

// router.delete('todo/:todoId', (req, res, next) => {
//   const { todoId } = req.params;
//   const todoIndex = todos.findIndex(item => item.id === todoId);

//   if (todoIndex > -1) {
//     return res.status(200).json({ ...todos.filter(item => item.id !== todoId) });
//   }

//   res.status(404).json({ message: 'Could not find todo for this id.' });
// });

export default router;
