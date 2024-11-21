import express from 'express';
import { bookRoom, checkOut } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/check', checkOut);
router.post('/room', authorization, bookRoom);

export default router;
