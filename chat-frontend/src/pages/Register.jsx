import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './Login.scss'
import '../App.scss'
import { useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const name = useRef();
    const userName = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => { }, [])

    const RegisterUser = async (e) => {
        e.preventDefault();
        setError(password.current.value != confirmPassword.current.value ? 'Passwords does not match' : null)

        try {
            const response = await axios.post('http://localhost:5000/api/user/register', {
                name: name.current.value,
                userName: userName.current.value,
                password: password.current.value
            })
            console.log('response:', response)

            navigate('/login');

        } catch (error) {
            console.log('error', error)
            setError(error.response.data.message);
        }
    }

    return (
        <div className="login-wrapper">
            <div>Register</div>
            <form action={postMessage}>
                <div className="input">
                    <label>Name</label>
                    <input type='text' ref={name}></input>
                </div>
                <div className="input">
                    <label>Username</label>
                    <input type='text' ref={userName}></input>
                </div>
                <div className="input">
                    <label>Password</label>
                    <input type='password' ref={password}></input>
                </div>
                <div className="input">
                    <label>Confirm Password</label>
                    <input type='password' ref={confirmPassword}></input>
                </div>
                {error && <p className='error-message'>{error}</p>}
                <button onClick={RegisterUser}>Register</button>
            </form>
            <p>Already a member? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Register