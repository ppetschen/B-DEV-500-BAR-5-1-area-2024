import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
// import Header from './Header';

export default function Layout() {
    const navigate = useNavigate()

  useEffect(() => {
    const isConnected = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) navigate('/login');
    }
    isConnected()
  })
  
    return (
        <div className='flex flex-row w-screen h-screen overflow-hidden bg-neutral-100'>
            <Sidebar />
            <div className='flex-1 h-full'>
                <Header/>
                <div className='h-full p-4'>{<Outlet />}</div>
            </div>
        </div>
    )
}