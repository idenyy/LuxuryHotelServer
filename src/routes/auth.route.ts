import express from 'express';
import { authCheck, login, logout, sendVerificationCode, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/check', verifyToken, authCheck);

router.post('/signup', signup);
router.post('/signup/verify', sendVerificationCode);

router.post('/login', login);

router.delete('/logout', logout);

export default router;
