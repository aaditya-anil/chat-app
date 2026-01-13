import axios, { Axios } from 'axios';
import React from 'react'
import { useRef } from 'react'
import './Login.scss'
import '../App.scss'
import { logChat } from '../services/logChat';

const FindUser = () => {
    const userId = useRef();

    async function searchUser() {
        const userData = await axios.get(
            'http://localhost:5000/api/user/getUser',
            {
                params: {
                    userName: userId.current.value,
                },
            }
        );
        console.log(userData);

        const helloObj = {
            message: "",
            sender: localStorage.getItem('userName'),
            receiver: userData.data.user
        };
        logChat(helloObj)
        window.location.reload();
    }

    return (
        <div>
            <input type='text' ref={userId} />
            <button onClick={searchUser}></button>
        </div>
    )
}

export default FindUser