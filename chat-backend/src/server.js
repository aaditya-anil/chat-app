import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import connectDatabase from './db.js'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chatRoute.js'
import chatModel from './models/ChatModel.js'

const port = 5000;
const app = express();
const server = http.createServer(app)
connectDatabase();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

server.listen(port, () => {
    console.log(`app is running on port ${port}`);
});


//Socket Start
const OnlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(`user is connected ${socket.id}`)

    socket.on('register_user', (userId) => {
        console.log(`User with userId ${userId} is online`)
        OnlineUsers.set(userId, socket.id)
    })

    socket.on('private_message', async ({ sender, receiver, message }) => {

        try {
            await chatModel.create({
                message,
                senderId: sender,
                receiverId: receiver
            });
        } catch (err) {
            console.error('Failed to persist message:', err);
            socket.emit('message_error', { error: 'Message could not be saved' });
            return;
        }

        const recipientSocketId = OnlineUsers.get(receiver);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private_message_from_backend', {
                Sender: sender,
                Message: message
            });
        }
    })

    socket.on('disconnect', () => {
        for (const [userId, socketId] of OnlineUsers.entries()) {
            if (socketId === socket.id) {
                OnlineUsers.delete(userId);
                console.log(`User ${userId} went offline`);
                break;
            }
        }
    })
})
