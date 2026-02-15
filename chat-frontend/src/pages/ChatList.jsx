import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Chat from './Chat';
import FindUser from './FindUser';
import { useNavigate } from 'react-router-dom';
import UserChat from '../components/UserChat';
import './ChatList.scss'

import { MdOutlinePersonSearch } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";



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
        <div className='chat-window-wrapper'>
            <div className="sidepane">
                <div className="self-user-detail">
                    <FaUserCircle size='30' />
                    <p className='user-name'>Sarah West</p>
                    <MdOutlinePersonSearch size='20' />
                    <RiLogoutCircleLine size='20' />
                </div>
                <div className="chat-user-list">
                    <ul>
                        {userList.map(x => (
                            <UserChat username={x} onClick={() => setShowChat(x)} />
                        ))}
                        {console.log(showChat)}
                    </ul>
                </div>
            </div>
            <div className="chat-window">
                {showChat &&
                    <>
                        <div className="User-header">
                            <FaUserCircle size='30' />
                            <p>{showChat}</p>
                        </div>
                        <Chat receiverId={showChat} />
                    </>
                }
            </div>



            {/*  */}
        </div >
    )
}

export default ChatList