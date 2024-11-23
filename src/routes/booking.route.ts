import express from 'express';
import { cancel, checkOutRoom, checkOutTable, endTable } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/room', authorization, checkOutRoom);
router.put('/cancel', authorization, cancel);

router.post('/table', authorization, checkOutTable);
router.put('/table/:bookingId', authorization, endTable);

export default router;
