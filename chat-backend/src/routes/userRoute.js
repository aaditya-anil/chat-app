import express from 'express'
import { getUser, logoutUser } from '../controller/UserController.js'

const router = express.Router();

router.post('/logout', logoutUser);
router.get('/getUser', getUser);


export default router;