import { Router } from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', contactRouter);

export default router;
