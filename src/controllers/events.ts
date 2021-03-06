import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { Event, TCreateEvent, TPatchEvent } from 'models/event';
import HttpError from 'models/httpError';

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let events = [];
  try {
    events = await Event.find().populate(['owner', 'attendees']);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }
  res
    .status(200)
    .json(events.map((event) => event.toObject({ getters: true })));
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;

  let event;
  try {
    event = await Event.findById(eventId).populate(['owner', 'attendees']);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }
  if (event) return res.status(200).json(event.toObject({ getters: true }));
  next(new HttpError('Event not found', 404));
};

export const getEventsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let events = [];
  try {
    events = await Event.find({ owner: userId }).populate([
      'owner',
      'attendees',
    ]);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  if (events.length)
    return res
      .status(200)
      .json(events.map((event) => event.toObject({ getters: true })));
  next(new HttpError('No events found', 404));
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));

  const { title, description, startsAt, capacity }: TCreateEvent = req.body;
  const createdEvent = new Event({
    title,
    description,
    startsAt,
    capacity,
    owner: req.userData?.id || null,
    attendees: [],
  });

  try {
    await createdEvent.save();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(201).json(createdEvent.toObject({ getters: true }));
};
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs', 422));

  const { eventId } = req.params;
  const { body }: { body: TPatchEvent } = req;

  if (!body) return next(new HttpError('Request body was not provided', 400));

  let event;
  try {
    event = await Event.findOneAndUpdate(
      { _id: eventId, owner: req.userData?.id },
      body,
      { new: true }
    );
    if (!event) return next(new HttpError('Could not update event', 403));
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }
  res.status(200).json(event?.toObject({ getters: true }));
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;

  let event;
  try {
    event = await Event.findOneAndDelete({
      _id: eventId,
      owner: req.userData?.id,
    });
    if (!event) return next(new HttpError('Could not delete event', 403));
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(200).json({ message: 'Event deleted successfully' });
};

export const attendEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userData,
    params: { eventId },
  } = req;

  let event;
  try {
    event = await Event.findById(eventId);
    if (event?.attendees.indexOf(userData?.id as never) !== -1)
      return next(new HttpError('User already attends event', 409));
    event?.attendees.push(userData?.id as never);
    event?.save();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }
  res.status(200).json(event?.toObject({ getters: true }));
};

export const unAttendEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userData,
    params: { eventId },
  } = req;

  let event;
  try {
    event = await Event.findById(eventId);
    if (event?.attendees.indexOf(userData?.id as never) === -1)
      return next(new HttpError('User does not attend event', 409));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event?.attendees.pull(userData?.id);

    event?.save();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }
  res.status(200).json(event?.toObject({ getters: true }));
};
