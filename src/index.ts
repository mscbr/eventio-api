import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import eventsRoutes from 'routes/events';
import usersRoutes from 'routes/users';
import HttpError from 'models/httpError';

const app: Application = express();

app.use(bodyParser.json());

app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);

// when no above routes matched
app.use(() => {
  const error = new HttpError('Could not find this route', 404);
  throw error; // this will reach default error handler
});

// default error handler
app.use(
  (
    error: { code: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) return next(error);
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  }
);

app.listen(5000, () => {
  console.log('app running on 5000');
});
