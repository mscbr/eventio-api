import { Router } from 'express';
import { body } from 'express-validator';

import {
  getEvents,
  getEventById,
  getEventsByUser,
  createEvent,
  updateEvent,
  deleteEvent,
} from 'controllers/events';
import { objectKeys } from 'utils/validation/validators';

const router = Router();

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
    body().custom(objectKeys(['title', 'description', 'startsAt', 'capacity'])),
    body('title').if(body('title').exists()).isString().trim(),
    body('description').if(body('description').exists()).isString().trim(),
    body('startsAt').if(body('startsAt').exists()).isISO8601(),
    body('capacity').if(body('capacity').exists()).isInt({ min: 1, max: 50 }),
  ],
  updateEvent
);

router.delete('/:eventId', deleteEvent);

export default router;
