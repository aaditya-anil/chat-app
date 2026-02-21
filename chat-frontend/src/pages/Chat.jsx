import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import api from '../services/api';
import './Chat.scss'
import { logChat } from '../services/logChat';

const Chat = ({ receiverId, socketRef }) => {
    const [messages, setMessages] = useState([]);
    const [userName] = useState(localStorage.getItem('userName'));
    const message = useRef();
    const messagesEndRef = useRef(null);

    const showOldMessages = async () => {
        try {
            const obj = {
                sender: userName,
                receiver: receiverId
            }
            const response = await api.get('chat/getchat', { params: obj })

            return response.data.chat;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleIncomingMessage = ({ Sender, Message }) => {
            setMessages(prev => [
                ...prev,
                { message: Message, senderId: Sender, receiverId: userName }
            ])
        }

        socket.on('private_message_from_backend', handleIncomingMessage);

        return () => {
            socket.off('private_message_from_backend', handleIncomingMessage);
        };

    }, []);

    useEffect(() => {
        const loadOldMessages = async () => {
            const oldMessages = await showOldMessages();
            setMessages(oldMessages || [])

        }
        loadOldMessages();
    }, [receiverId])

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const sendMessage = () => {
        const messageText = message.current.value.trim();
        const socket = socketRef.current;


        if (messageText == "") return;

        socket.emit("private_message", { sender: userName, receiver: receiverId, message: messageText });

        const chatObj = {
            message: messageText,
            sender: userName,
            receiver: receiverId
        };
        logChat(chatObj);
        setMessages(prev => [...prev, { message: messageText, senderId: userName, receiverId: receiverId }])

        message.current.value = "";
        message.current.focus();
    }


    return (
        <div className='message-wrapper'>
            <div className="message-box">
                <div className='messages'>
                    {messages.map((msg, index) => {
                        const isMyMessage = msg.senderId === userName;

                        return (
                            <p
                                key={msg._id || index}
                                className={isMyMessage ? "my-message" : "other-message"}
                            >
                                {msg.message}
                            </p>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="input-field">
                    <input type='text' ref={message} id='sendMessage' placeholder='Type a message..' name='sendMessage' onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); } }} />
                </div>
            </div>
        </div>
    )
}

export default Chat