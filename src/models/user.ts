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
