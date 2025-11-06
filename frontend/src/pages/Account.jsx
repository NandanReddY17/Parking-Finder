import React from 'react'
import { sessionStore, bookingStore } from '../utils/appStorage'

const Account = () => {
  const user = sessionStore.getCurrentUser()
  const bookings = user ? bookingStore.byUser(user.id) : []
  const active = bookings.filter(b => b.status === 'active')
  const history = bookings.filter(b => b.status !== 'active')

  if (!user) {
    return (
      <div className='h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white p-6 rounded-2xl shadow-md w-full max-w-sm text-center'>
          <h1 className='text-xl font-bold text-gray-800 mb-2'>You are not logged in</h1>
          <p className='text-sm text-gray-600 mb-4'>Log in to view your bookings and history.</p>
          <div className='flex gap-2'>
            <a className='flex-1 bg-blue-600 text-white py-2 rounded-lg' href='/login'>Login</a>
            <a className='flex-1 bg-gray-100 py-2 rounded-lg' href='/signup'>Sign up</a>
          </div>
        </div>
      </div>
    )
  }

  const logout = () => {
    sessionStore.clear()
    window.location.href = '/'
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto space-y-4'>
        <div className='bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>{user.name}</h1>
            <p className='text-sm text-gray-600'>{user.email}</p>
          </div>
          <button onClick={logout} className='px-4 py-2 bg-gray-100 rounded-lg'>Logout</button>
        </div>

        <section className='bg-white p-5 rounded-2xl shadow-sm'>
          <h2 className='text-lg font-semibold mb-3'>Active bookings</h2>
          {active.length === 0 ? (
            <p className='text-sm text-gray-600'>No active bookings.</p>
          ) : (
            <ul className='space-y-3'>
              {active.map(b => (
                <li key={b.id} className='border rounded-xl p-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>{b.parkingName}</p>
                      <p className='text-xs text-gray-600'>{b.address}</p>
                      <p className='text-xs text-gray-600 mt-1'>Start: {new Date(b.startTime).toLocaleString()}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold'>₹{b.pricePerHour.toFixed(2)}/hr</p>
                      <p className='text-xs text-gray-500'>For {b.durationHours}h</p>
                    </div>
                  </div>
                  <div className='mt-3 flex justify-end'>
                    <button
                      className='px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm'
                      onClick={() => {
                        const input = window.prompt('Rate your parking (1-5)', '5');
                        if (!input) return;
                        const rating = Math.max(1, Math.min(5, parseFloat(input)));
                        bookingStore.complete(b.id, rating);
                        window.location.reload();
                      }}
                    >
                      Done
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className='bg-white p-5 rounded-2xl shadow-sm'>
          <h2 className='text-lg font-semibold mb-3'>History</h2>
          {history.length === 0 ? (
            <p className='text-sm text-gray-600'>No past bookings.</p>
          ) : (
            <ul className='space-y-3'>
              {history.map(b => (
                <li key={b.id} className='border rounded-xl p-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>{b.parkingName}</p>
                      <p className='text-xs text-gray-600'>{b.address}</p>
                      {'rating' in b && (
                        <p className='text-xs text-gray-600 mt-1'>Your rating: {b.rating} / 5</p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold'>₹{b.pricePerHour.toFixed(2)}/hr</p>
                      <p className='text-xs text-gray-500 capitalize'>{b.status}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default Account
