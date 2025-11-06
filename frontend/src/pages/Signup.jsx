import React, { useState } from 'react'
import { userStore, sessionStore } from '../utils/appStorage'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = userStore.create({ name, email, password })
      sessionStore.set(user)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Unable to create account')
    }
  }

  return (
    <div className='h-screen flex items-center justify-center relative bg-gray-900'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30'
        style={{
          backgroundImage: 'url(https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg)'
        }}
      ></div>
      <div className='absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50'></div>
      
      {/* Content */}
      <form onSubmit={submit} className='relative z-10 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20'>
        <h1 className='text-xl font-bold mb-4 text-gray-800'>Create Account</h1>
        {error && <div className='bg-red-50 text-red-700 p-2 rounded mb-3 text-sm'>{error}</div>}
        <label className='block text-sm text-gray-600 mb-1'>Full name</label>
        <input className='w-full border rounded px-3 py-2 mb-3' value={name} onChange={(e)=>setName(e.target.value)} required/>
        <label className='block text-sm text-gray-600 mb-1'>Email</label>
        <input className='w-full border rounded px-3 py-2 mb-3' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <label className='block text-sm text-gray-600 mb-1'>Password</label>
        <input className='w-full border rounded px-3 py-2 mb-4' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium'>Sign up</button>
        <p className='text-xs text-gray-600 mt-3'>Have an account? <a className='text-blue-600' href='/login'>Login</a></p>
      </form>
    </div>
  )
}

export default Signup
