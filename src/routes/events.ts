import { Router } from 'express';
import { check } from 'express-validator';

import {
  getEvents,
  getEventById,
  getEventsByUser,
  createEvent,
  updateEvent,
  deleteEvent,
} from 'controllers/events';

const router = Router();

router.get('/', getEvents);

router.get('/:eventId', getEventById);
router.get('/user/:userId', getEventsByUser);

router.post(
  '/',
  [
    check(['title', 'description, startsAt']).notEmpty(),
    check('capacity').isInt({ min: 1, max: 50 }),
  ],
  createEvent
);
router.patch('/:eventId', updateEvent);

router.delete('/:eventId', deleteEvent);

export default router;
