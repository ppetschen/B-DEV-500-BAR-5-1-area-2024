// src/components/Layout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';

const Layout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('currentUser');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
