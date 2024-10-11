import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { useAuth } from '../../../page/auth/AuthContext'

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login')
  }
  
  return (
    <nav className="w-64 h-screen p-5 bg-gray-900">
      <h2 className="mb-5 font-serif text-2xl text-white">AREA</h2>
      <ul className="space-y-2">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => 
            `block py-2 px-4 rounded transition-colors duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`
          }>
            Create New Area
          </NavLink>
        </li>
        <li>
          <NavLink to="/current-area" className={({ isActive }) => 
            `block py-2 px-4 rounded transition-colors duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`
          }>
            Your current Area
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className={({ isActive }) => 
            `block py-2 px-4 rounded transition-colors duration-200 ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`
          }>
            Our Services
          </NavLink>
        </li>
      </ul>
      <Button 
          onClick={handleLogout}
          className="fixed py-5 mt-8 font-semibold text-white transition-colors duration-300 bg-red-500 rounded-md bottom-4 left-4 x-4 hover:bg-gray-700"
        >
          LogOut
        </Button>
    </nav>
  );
};

export default Sidebar;
