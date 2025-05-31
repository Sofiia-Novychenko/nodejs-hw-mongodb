import { Router } from 'express';
import contactRouter from '../routers/contacts.js';
import authRouter from '../routers/auth.js';

const router = Router();

router.use('/contacts', contactRouter);
router.use('/auth', authRouter);

export default router;
