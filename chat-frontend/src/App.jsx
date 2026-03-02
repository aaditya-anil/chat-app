import React, { Children, StrictMode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import ChatList from './pages/ChatList'
import './App.scss'

const App = () => {

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/chatlist' element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
    </Routes>
  )
}

export default App