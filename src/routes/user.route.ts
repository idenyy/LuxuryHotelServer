import express from 'express';
import { getBookings } from '../controllers/user.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.get('/bookings', authorization, getBookings);

export default router;
