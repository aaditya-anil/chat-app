import chatModel from "../models/ChatModel.js";

export const getChatList = async (req, res) => {
    try {
        const userId = req.query.userName;
        const receivers = await chatModel.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).select("senderId receiverId -_id")

        const uniqueUsers = new Set();

        receivers.forEach(chat => {
            if (chat.senderId !== userId) uniqueUsers.add(chat.senderId);
            if (chat.receiverId !== userId) uniqueUsers.add(chat.receiverId);
        });

        return res.status(200).json({
            message: "Chat list fetched",
            receivers: Array.from(uniqueUsers)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error
        })
    }
}

export const logChat = async (req, res) => {
    try {
        const { message, receiver, sender } = req.body;
        await chatModel.create({
            message,
            senderId: sender,
            receiverId: receiver
        })

        return res.status(200).json({
            message: 'Chat Updated'
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const getChat = async (req, res) => {
    try {
        const { sender, receiver } = req.query;

        const msgObjects = await chatModel.find({
            $or: [
                { senderId: sender, receiverId: receiver },
                { senderId: receiver, receiverId: sender }
            ]
        }).sort({ createdAt: -1 }).limit(100);

        return res.status(200).json({
            message: "old chat",
            chat: msgObjects.reverse()
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}