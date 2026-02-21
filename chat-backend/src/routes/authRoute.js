import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controller/AuthController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

export default router;