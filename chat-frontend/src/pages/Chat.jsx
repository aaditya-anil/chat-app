import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from 'axios';

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
            setMessages(messages => [...messages, chatObj])
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

        socket.emit("private_message", { sender: senderId, receiver: receiverId2, message: messageR });
        const sendObj = {
            message: messageR,
            sender: senderId,
            receiver: receiverId2
        };

        setMessages(prev => [...prev, { message: messageR, senderId: senderId, receiverId: receiverId2 }])
        logChat(sendObj);
    }

    const logChat = async (obj) => {
        try {
            const response = await axios.post('http://localhost:5000/api/chat/log', obj)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className='messages'>
                {messages.map((msg) => (
                    <p key={Math.floor(Math.random() * 1000)}>{msg.senderId} : {msg.message} </p>
                ))}
            </div>

            {userName != null && (
                <>
                    <input type='text' ref={message} id='sendMessage' placeholder='sendMessage' name='sendMessage'></input>
                    <button onClick={sendMessage}>send</button>
                </>
            )}

        </>
    )
}

export default Chat