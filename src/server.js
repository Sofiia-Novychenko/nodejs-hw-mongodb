import 'dotenv/config';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

//* parseInt() parses up to the first non-digit and returns whatever it had parsed. Better than Number()
const PORT = parseInt(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  //CORS (Cross-Origin Resource Sharing) - це інструмент безпеки для веб-додатків,
  //який дозволяє обмінюватися інформацією між веб-ресурсами з різних доменів.
  app.use(cors());
  //Для роботи із кукі (як міделвара)
  app.use(cookieParser());
  // Логування запитів
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

  app.use('/photos', express.static(path.resolve('src', 'uploads', 'photos')));
  app.use('/api-docs', swaggerDocs());
  app.use(router);

  //* найбільш універсальний спосіб обробити "все, що не співпало з маршрутами вище"
  // app.use('*', notFoundHandler);
  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
