import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
    const [userList, setUserList] = useState([]);
    const [showChat, setShowChat] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchChatList = async () => {
            const userId = localStorage.getItem('userName')
            const userList = await axios.get(`http://localhost:5000/api/chat/chatlist?userName=${userId}`);
            setUserList(userList.data.receivers);
            console.log(userList)
        }
        fetchChatList();
    }, [])


    return (
        <div>
            {showChat == null &&
                <>
                    <ul>
                        {userList.map(x => (
                            <li key={x} onClick={() => setShowChat(x)}>{x}</li>
                        ))}
                    </ul>
                    <button onClick={() => {
                        localStorage.setItem('userName', null);
                        localStorage.setItem('token', null);
                        nav('/login');
                    }}>Logout</button>
                </>
            }

            {showChat &&
                <>
                    <Chat receiverId={showChat} />
                    <button onClick={() => setShowChat(null)}>Back</button>
                </>
            }


        </div>
    )
}

export default ChatList