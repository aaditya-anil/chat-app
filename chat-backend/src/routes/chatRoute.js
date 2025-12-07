import express from 'express'
import { getChatList, logChat, getChat } from '../controller/ChatController.js'

const router = express.Router();

router.get('/chatlist', getChatList)
router.post('/log', logChat)
router.get('/getchat', getChat)

export default router