import express from 'express';
import { checkOut } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/check', authorization, checkOut);

export default router;
