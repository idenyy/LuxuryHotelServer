import express from 'express';
import { create } from '../controllers/room.controller.js';
import { getRoomReviews, createReview } from '../controllers/review.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', create);

// Review
router.post('/reviews', authorization, createReview);
router.get('/:roomType/reviews', getRoomReviews);

export default router;
