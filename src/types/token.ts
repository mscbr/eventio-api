export type TTokenPayload = {
  user: { id: string; email: string };
  iat: number;
  exp: number;
};
