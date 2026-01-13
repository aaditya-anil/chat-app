import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from 'axios';
import './Chat.scss'
import { logChat } from '../services/logChat';

const Chat = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [userName, setUserName] = useState(null);
    const message = useRef();

    const showOldMessages = async () => {
        try {
            const obj = {
                sender: localStorage.getItem('userName'),
                receiver: receiverId
            }
            const response = await axios.get('http://localhost:5000/api/chat/getchat', { params: obj })
            console.log('OLDmessages', response)
            return response.data.chat;
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const oldMessages = async () => {
            const oldMessages = await showOldMessages();
            setMessages(oldMessages)

        }

        const socket = io('http://localhost:5000');
        setSocket(socket);

        setUserName(localStorage.getItem('userName'));
        socket.emit('register_user', localStorage.getItem('userName'));
        oldMessages();

        socket.on('private_message_from_backend', ({ Sender, Message }) => {
            const chatObj = {
                message: Message,
                sender: Sender,
                receiver: localStorage.getItem('userName')
            };
            setMessages(messages => [...messages, { message: chatObj.message, senderId: chatObj.sender, receiverId: chatObj.receiver }])
            logChat(chatObj);
        })



        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        const messageR = message.current.value;
        const senderId = localStorage.getItem('userName');
        const receiverId2 = receiverId;

        if (messageR == "") {
            return;
        }

        socket.emit("private_message", { sender: senderId, receiver: receiverId2, message: messageR });
        const sendObj = {
            message: messageR,
            sender: senderId,
            receiver: receiverId2
        };

        setMessages(prev => [...prev, { message: messageR, senderId: senderId, receiverId: receiverId2 }])
        logChat(sendObj);
    }


    return (
        <div className='message-wrapper'>
            <div className="message-box">
                <div className='messages'>
                    {messages.slice(-10).map((msg) => (
                        <p key={Math.floor(Math.random() * 1000)}>{msg.senderId} : {msg.message} </p>
                    ))}
                </div>
                <br></br>
                <input type='text' ref={message} id='sendMessage' placeholder='sendMessage' name='sendMessage'></input>
                <button onClick={sendMessage}>send</button>
            </div>
        </div>
    )
}

export default Chat