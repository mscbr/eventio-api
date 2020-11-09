import { IUser } from './user';

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
