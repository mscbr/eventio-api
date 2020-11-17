import { Schema, model } from 'mongoose';

export const UserModel = model(
  'User',
  new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, min: Date.now, default: Date.now },
    updatedAt: {
      type: Date,
      min: Date.now,
      default: Date.now,
      setDefaultsOnInsert: true,
    },
    password: { type: String, required: true },
  })
);

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // ISO-formatted datetime
  updatedAt: string; // ISO-formatted datetime
  password?: string;
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
