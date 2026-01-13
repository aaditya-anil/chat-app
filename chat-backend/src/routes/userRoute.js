import express from 'express'
import { registerUser, loginUser, getUser } from '../controller/UserController.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser)
router.get('/getUser', getUser)

export default router;