import express from 'express';
import { add } from '../controllers/room.controller.js';
import { create, getRoomReviews } from '../controllers/review.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', add);

// Review
router.post('/reviews', authorization, create);
router.get('/reviews', getRoomReviews);

export default router;
