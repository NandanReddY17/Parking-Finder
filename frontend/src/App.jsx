import React from 'react'
import { Route, Routes, Link, Navigate } from 'react-router-dom'
import ParkingFinder from './pages/ParkingFinder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import { sessionStore } from './utils/appStorage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          sessionStore.getCurrentUser() ? <ParkingFinder/> : <Navigate to='/login' replace />
        } />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/account' element={
          sessionStore.getCurrentUser() ? <Account/> : <Navigate to='/login' replace />
        } />
        <Route path='*' element={<ParkingFinder/>} />
      </Routes>
    </div>
  )
}

export default App