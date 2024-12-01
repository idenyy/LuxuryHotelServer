import express from 'express';
import { deleteProfile, getBookings, getProfile, updateProfile } from '../controllers/user.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.get('/:id', authorization, getProfile);
router.post('/update', authorization, updateProfile);
router.delete('/', authorization, deleteProfile);

router.get('/bookings', authorization, getBookings);

export default router;
