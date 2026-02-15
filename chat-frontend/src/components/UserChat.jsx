import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import '../components/UserChat.scss'



const UserChat = (props) => {
    return (
        <div className='user-chat-wrapper' onClick={props.onClick}>
            <FaUserCircle size='20' />
            <div className="user-name-chat">
                <p>{props.username}</p>
                <p className='last-chat'>last chat appears here, and should be truncated..</p>
            </div>
            <p className='message-time'>10:32 AM</p>
        </div>
    )
}

export default UserChat