import { Router } from 'express';
import express from 'express';
import {
  getAllContactsController,
  getOneContactController,
  deleteOneContactController,
  createOneContactController,
  patchOneContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { IsValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contact.js';
import { patchedContactSchema } from '../validation/contact.js';

const router = Router();
//* Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
//* наприклад, у запитах POST або PATCH
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get(
  '/contacts/:contactId',
  IsValidID,
  ctrlWrapper(getOneContactController),
);

router.delete(
  '/contacts/:contactId',
  IsValidID,
  ctrlWrapper(deleteOneContactController),
);

router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createOneContactController),
);

router.patch(
  '/contacts/:contactId',
  IsValidID,
  jsonParser,
  validateBody(patchedContactSchema),
  ctrlWrapper(patchOneContactController),
);

export default router;
