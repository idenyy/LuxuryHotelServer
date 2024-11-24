import express from 'express';
import { cancelRoom, cancelTable, checkRoom, checkTable, extendRoom } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/room', authorization, checkRoom);
router.put('/room/cancel', authorization, cancelRoom);
router.put('/room/extend', authorization, extendRoom);

router.post('/table', authorization, checkTable);
router.put('/table/:bookingId', authorization, cancelTable);

export default router;
