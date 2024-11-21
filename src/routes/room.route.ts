import express from 'express';
import { add } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/', add);

export default router;
