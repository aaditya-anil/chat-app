import React, { StrictMode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import ChatList from './pages/ChatList'
import './App.scss'

const App = () => {


  return (
    <StrictMode>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/chatlist' element={<ChatList />} />
      </Routes>
    </StrictMode>
  )
}

export default App