import { Router } from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', authenticate, contactRouter);

export default router;
