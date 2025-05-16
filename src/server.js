import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

//* parseInt() parses up to the first non-digit and returns whatever it had parsed. Better than Number()
const PORT = parseInt(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, resp) => {
    resp.json({ message: 'Hi! Contact base is here:3' });
  });

  app.use(contactsRouter);

  //* найбільш універсальний спосіб обробити "все, що не співпало з маршрутами вище"
  // app.use('*', notFoundHandler);
  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
