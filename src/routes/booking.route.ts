import express from 'express';
import { addServices, cancel, checkRoom, checkTable, endTable, extendRoom } from '../controllers/booking.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/room', authorization, checkRoom);
router.put('/room/extend', authorization, extendRoom);
router.put('/room/services', authorization, addServices);

router.post('/table', authorization, checkTable);
router.put('/table/end', authorization, endTable);

router.put('/cancel', authorization, cancel);

export default router;
