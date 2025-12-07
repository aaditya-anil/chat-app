import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.scss'
import '../App.scss'
import { useRef } from 'react'
import axios from 'axios'
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
            const response = await axios.post('http://localhost:5000/api/user/login', {
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
            <div>Login</div>
            <form action={postMessage}>
                <div className="username-input input">
                    <label>Username</label>
                    <input type='text' ref={userName}></input>
                </div>
                <div className="password-input input">
                    <label>Password</label>
                    <input type='password' ref={password}></input>
                </div>
                {error && <p className='error-message'>{error}</p>}
                <button onClick={HandleLogin}>Log In</button>
                <p>Join us now, by clicking <a href='/Register'>Register Now</a></p>
            </form>
        </div>
    )
}

export default Login