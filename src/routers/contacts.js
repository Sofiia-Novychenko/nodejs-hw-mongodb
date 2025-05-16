import { Router, express } from 'express';
import {
  getAllContactsController,
  getOneContactController,
  deleteOneContactController,
  createOneContactController,
  patchOneContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();
//* Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
//* наприклад, у запитах POST або PATCH
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getOneContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteOneContactController));

router.post('/contacts', jsonParser, ctrlWrapper(createOneContactController));

router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchOneContactController),
);

export default router;
