import express from 'express';
import { addServices, cancelRoom, cancelTable, checkRoom, checkTable, extendRoom } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/room', authorization, checkRoom);
router.put('/room/cancel', authorization, cancelRoom);
router.put('/room/extend', authorization, extendRoom);
router.put('/room/services', authorization, addServices);

router.post('/table', authorization, checkTable);
router.put('/table/cancel', authorization, cancelTable);

export default router;
