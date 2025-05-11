import { Router } from 'express';
import {
  getAllContactsController,
  getOneContactController,
} from '../controllers/contacts';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getOneContactController));

export default router;
