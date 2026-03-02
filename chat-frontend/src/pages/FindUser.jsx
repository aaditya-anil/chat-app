import api from '../services/api';
import React, { useState } from 'react'
import { useRef } from 'react'
import './Login.scss'
import '../App.scss'
import { logChat } from '../services/logChat';
import { BsX } from "react-icons/bs";

const FindUser = ({ closeModal, addUserChat }) => {
    const userId = useRef();
    const [userData, setUserData] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    async function searchUser(e) {
        e.preventDefault();
        const response = await api.get(
            'user/getUser',
            {
                params: {
                    userName: userId.current.value,
                },
            }
        );
        const filteredUser = response.data.user.filter(
            user => user !== localStorage.getItem('userName')
        )
        setUserData(filteredUser);
        setHasSearched(true);
    }

    const createChat = (userName) => {
        addUserChat(userName);
        closeModal();
    }

    return (
        <div className='search-user-modal'>
            <div className="header">
                <p>Search User</p>
                <BsX onClick={closeModal} size={30} />
            </div>
            <div className="search-bar">
                <form onSubmit={searchUser}>
                    <input type='text' ref={userId} />
                    <button > Search </button>
                </form>
            </div>
            <div className="listing">
                {!hasSearched ? null : userData.length == 0 ? (
                    <ul>
                        <li className='not-found-text'>Users Not Found</li>
                    </ul>
                ) : (
                    <ul>
                        {userData.map((x) => (
                            <li key={x} onClick={() => createChat(x)}>{x}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default FindUser