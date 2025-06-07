import { Router } from 'express';
import express from 'express';
import {
  getAllContactsController,
  getOneContactController,
  deleteOneContactController,
  createOneContactController,
  patchOneContactController,
} from '../controllers/contacts.js';
import { upload } from '../middlewares/upload.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { IsValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contact.js';
import { patchedContactSchema } from '../validation/contact.js';

const router = Router();
//* Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
//* наприклад, у запитах POST або PATCH
const jsonParser = express.json();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', IsValidID, ctrlWrapper(getOneContactController));

router.delete(
  '/:contactId',
  IsValidID,
  ctrlWrapper(deleteOneContactController),
);

router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createOneContactController),
);

router.patch(
  '/:contactId',
  IsValidID,
  jsonParser,
  validateBody(patchedContactSchema),
  ctrlWrapper(patchOneContactController),
);

export default router;
