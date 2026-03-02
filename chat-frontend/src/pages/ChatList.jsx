import React, { useEffect, useState } from 'react'
import api from '../services/api';
import Chat from './Chat';
import FindUser from './FindUser';
import { useNavigate } from 'react-router-dom';
import UserChat from '../components/UserChat';
import './ChatList.scss'
import useSocket from '../hooks/useSocket';

import { MdOutlinePersonSearch } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";



const ChatList = () => {
    const [userList, setUserList] = useState([]);
    const [showChat, setShowChat] = useState(null);
    const [showFindUser, setShowFindUser] = useState(false);
    const nav = useNavigate();

    const userName = localStorage.getItem('userName');
    const socketRef = useSocket(userName);


    useEffect(() => {
        const fetchChatList = async () => {
            const userList = await api.get(`chat/chatlist?userName=${userName}`);
            setUserList(userList.data.receivers);
        }
        fetchChatList();
    }, [])

    const executeLogout = async () => {
        try {
            const logoutResponse = await api.post(`user/logout`);

            localStorage.removeItem("userName");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            nav("/login")

        } catch (err) {
            console.log(err);
        }
    }

    const addNewChat = (userName) => {
        try {
            if (!userList.includes(userName)) {
                setUserList([...userList, userName]);
            }
            setShowChat(userName);
        } catch (error) {

        }
    }


    return (
        <div className='chat-window-wrapper'>
            <div className="sidepane">
                <div className="self-user-detail">
                    <FaUserCircle size='30' />
                    <p className='user-name'>{userName}</p>
                    <MdOutlinePersonSearch size='20' onClick={() => setShowFindUser(true)} />
                    <RiLogoutCircleLine size='20' onClick={executeLogout} />
                </div>
                <div className="chat-user-list">
                    <ul>
                        {userList.map(x => (
                            <UserChat username={x} onClick={() => setShowChat(x)} key={x._id} />
                        ))}
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
                        <Chat receiverId={showChat} socketRef={socketRef} />
                    </>
                }
            </div>
            {showFindUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <FindUser
                            closeModal={() => setShowFindUser(false)}
                            addUserChat={(userName) => addNewChat(userName)}
                        />
                    </div>
                </div>
            )}
        </div >
    )
}

export default ChatList