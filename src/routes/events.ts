import { Router } from 'express';
import { body } from 'express-validator';

import {
  getEvents,
  getEventById,
  getEventsByUser,
  createEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  unAttendEvent,
} from 'controllers/events';
import validateToken from 'middleware/validateToken';
import { objectKeys } from 'utils/bodyValidation';

const router = Router();

router.use(validateToken);

router.get('/', getEvents);

router.get('/:eventId', getEventById);
router.get('/user/:userId', getEventsByUser);

router.post(
  '/',
  [
    body().custom(objectKeys(['title', 'description', 'startsAt', 'capacity'])),
    body(['title', 'description']).notEmpty().trim().escape(),
    body('startsAt').isISO8601(),
    body('capacity').isInt({ min: 1, max: 50 }),
  ],
  createEvent
);
router.patch(
  '/:eventId',
  [
    body().custom(
      objectKeys(['title', 'description', 'startsAt', 'capacity', 'attendees'])
    ),
    body('title').if(body('title').exists()).isString().trim(),
    body('description').if(body('description').exists()).isString().trim(),
    body('startsAt').if(body('startsAt').exists()).isISO8601(),
    body('capacity').if(body('capacity').exists()).isInt({ min: 1, max: 50 }),
  ],
  updateEvent
);

router.delete('/:eventId', deleteEvent);

router.post('/:eventId/attendees/me', attendEvent);
router.delete('/:eventId/attendees/me', unAttendEvent);

export default router;
