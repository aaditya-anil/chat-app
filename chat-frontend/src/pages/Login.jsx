import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.scss'
import '../App.scss'
import { useRef } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const userName = useRef();
    const password = useRef();
    const navigate = useNavigate();

    const [error, setError] = useState();

    useEffect(() => { }, [])

    const HandleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('auth/login', {
                userName: userName.current.value,
                password: password.current.value
            })
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.userName);
            navigate('/chatlist');
        } catch (error) {
            console.log('error', error)
            setError(error.response.data.message);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-heading-text">
                    <br /><br />
                    <div className="conversation-user-wrapper">
                        <h3>Welcome back</h3>
                        <h5>Log in to continue your conversations</h5>
                    </div>
                </div>
                <div className="login-input-wrapper">
                    <div className="username-input input">
                        <label>Username</label>
                        <input type='text' ref={userName}></input>
                    </div>
                    <div className="password-input input">
                        <label>Password</label>
                        <input type='password' ref={password}></input>
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    {!error && <br />}
                    <button className='login-button' onClick={HandleLogin}>Log In</button>
                    <br /><br />
                    <div className="register-container">
                        <p>Join us now, by clicking <a href='/Register'>HERE</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login