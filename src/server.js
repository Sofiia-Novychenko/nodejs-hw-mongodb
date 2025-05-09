import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getOneContact } from './services/contacts.js';

dotenv.config();

//* parseInt() parses up to the first non-digit and returns whatever it had parsed. Better than Number()
const PORT = parseInt(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  //* Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  //* наприклад, у запитах POST або PATCH
  app.use(express.json());
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

  app.get('/contacts', async (req, resp) => {
    const contacts = await getAllContacts();

    resp.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, resp) => {
    const { contactId } = req.params;
    const contact = await getOneContact(contactId.trim());

    if (!contact) {
      resp.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    resp.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  //* найбільш універсальний спосіб обробити "все, що не співпало з маршрутами вище"
  app.use((req, resp, next) => {
    resp.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, resp, next) => {
    resp.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
