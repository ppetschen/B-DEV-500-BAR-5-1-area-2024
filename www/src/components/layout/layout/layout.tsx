// src/components/Layout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../Header';

const Layout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('currentUser');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className='flex-1 h-screen flex flex-col'>
        <Header />
        <main className="flex-1 bg-[#F7F7F9] h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
