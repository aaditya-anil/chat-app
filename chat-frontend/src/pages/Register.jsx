import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './Login.scss'
import '../App.scss'
import { useRef, useState } from 'react'
import api from '../services/api'
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
        if (password.current.value != confirmPassword.current.value) {
            setError('Passwords does not match');
            return;
        }
        setError(null)

        try {
            const response = await api.post('auth/register', {
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
            <div className="login-container">
                <br /><br />
                <div className="input-register">
                    <label>Name</label>
                    <input type='text' ref={name}></input>
                </div>
                <div className="input-register">
                    <label>Username</label>
                    <input type='text' ref={userName}></input>
                </div>
                <div className="input-register">
                    <label>Password</label>
                    <input type='password' ref={password}></input>
                </div>
                <div className="input-register">
                    <label>Confirm Password</label>
                    <input type='password' ref={confirmPassword}></input>
                </div>
                {error && <p className='error-message'>{error}</p>}
                {!error && <br></br>}
                <button className='login-button register-button' onClick={RegisterUser}>Register</button>
                <div className="register-container">
                    <p>Already a member? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div >
    )
}

export default Register