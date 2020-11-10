import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { IEvent, TCreateEvent, TPatchEvent } from 'models/event';
import HttpError from 'models/httpError';
import { mockEvents } from 'utils/mockData/events';

let events: IEvent[] = [...mockEvents];

export const getEvents = (req: Request, res: Response) => {
  res.status(200).json(events);
};

export const getEventById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;
  const targetEvent = events.find((event) => event.id === eventId);

  if (targetEvent) return res.status(200).json(targetEvent);
  next(new HttpError('Event not found', 404));
};

export const getEventsByUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const targetEvents = events.filter((event) => event.owner.id === userId);

  if (targetEvents.length) return res.status(200).json(targetEvents);
  next(new HttpError('No events found', 404));
};

export const createEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));

  const { title, description, startsAt, capacity }: TCreateEvent = req.body;
  const createdEvent: IEvent = {
    id: Date.now().toString(),
    title,
    description,
    startsAt,
    capacity,
    owner: {
      firstName: 'Thor',
      lastName: 'Odinson',
      email: 'thor@strv.com',
      id: '5e4be7f9df7691001f54346d',
      updatedAt: '2018-12-18T13:34:49.265Z',
      createdAt: '2018-02-18T13:34:49.265Z',
    },
    attendees: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events.push(createdEvent);

  res.status(201).json(createdEvent);
};

export const updateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;
  const { body }: { body: TPatchEvent } = req;

  const targetEvent = events.find((event) => event.id === eventId);
  if (!targetEvent) return next(new HttpError('Event not found', 404));
  if (!body) return next(new HttpError('Request body was not provided', 400));

  events = events.map((event) =>
    event.id === targetEvent?.id
      ? { ...targetEvent, ...(body as TPatchEvent) }
      : event
  );
  res.status(200).json({ ...targetEvent, ...(body as TPatchEvent) });
};

export const deleteEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;

  const targetEvent = events.find((event) => event.id === eventId);
  if (!targetEvent) return next(new HttpError('Event not found', 404));

  events = events.filter((event) => event.id !== targetEvent.id);
  res.status(200).json({ message: 'Deleted event' });
};
