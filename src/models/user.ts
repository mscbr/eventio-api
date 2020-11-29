import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // ISO-formatted datetime
  updatedAt: string; // ISO-formatted datetime
  password: string;
}

export type TCreateUser = Pick<
  IUser,
  'firstName' | 'lastName' | 'email' | 'password'
>;

export type TPatchUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type IUserDoc = IUser & Document;

export const User = model<IUserDoc>(
  'User',
  new Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true, select: false },
    },
    { timestamps: true }
  ).plugin(uniqueValidator)
);
