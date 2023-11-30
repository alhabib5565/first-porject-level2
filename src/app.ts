/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
const app: Application = express();

//perser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/', router);

app.get('/', (req: Request, res: Response) => {
  const a = 1;

  res.send(a);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
