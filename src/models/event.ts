import { Schema, model, Document } from 'mongoose';

import { IUser } from './user';

export interface IEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO-formatted datetime
  capacity: number;
  owner: string | IUser;
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

type IEventDoc = IEvent & Document;

export const Event = model<IEventDoc>(
  'Event',
  new Schema(
    {
      title: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      startsAt: { type: Date, min: Date.now, required: true },
      capacity: { type: Number, min: 1, required: true },
      owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      attendees: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    },
    { timestamps: true }
  )
);
