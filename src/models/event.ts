import { Schema, model } from 'mongoose';

import { IUser } from './user';

export const EventModel = model(
  'Event',
  new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startsAt: { type: Date, min: Date.now, required: true },
    capacity: { type: Number, min: 1, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, min: Date.now, default: Date.now },
    updatedAt: {
      type: Date,
      min: Date.now,
      default: Date.now,
      setDefaultsOnInsert: true,
    },
  })
);

export interface IEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO-formatted datetime
  capacity: number;
  owner: IUser;
  attendees: IUser[] | [];
  createdAt: string; // ISO-formatted datetime
  updatedAt: string; // ISO-formatted datetime
}

export type TCreateEvent = Pick<
  IEvent,
  'title' | 'description' | 'startsAt' | 'capacity'
>;

export type TPatchEvent = {
  title?: string;
  description?: string;
  startsAt?: string; // ISO-formatted datetime
  capacity?: number;
};
