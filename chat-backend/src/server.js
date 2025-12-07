import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import connectDatabase from './db.js'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chatRoute.js'

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
    console.log(`user is connect ${socket.id}`)

    var data;
    socket.on('register_user', (userId) => {
        console.log(`User with userId ${userId} is online`)
        OnlineUsers.set(userId, socket.id)
        console.log(OnlineUsers)
    })

    socket.on('private_message', ({ sender, receiver, message }) => {
        var userToSend = OnlineUsers.get(receiver);
        console.log(`senderId: ${sender}, receiverId: ${receiver}, msg: ${message}`)
        if (userToSend) {
            io.to(userToSend).emit('private_message_from_backend', { Sender: sender, Message: message })
        }
    })
})
//Socket End