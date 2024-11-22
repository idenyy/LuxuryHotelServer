import express from 'express';
import { cancel, checkOut } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/check', authorization, checkOut);

router.put('/cancel', authorization, cancel);

export default router;
