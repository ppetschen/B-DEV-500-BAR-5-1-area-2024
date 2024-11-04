import React from "react";
import { NavLink } from "react-router-dom";
import new_logo from "../../../public/new_logo.png";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/current-area", label: "Automation" },
  { path: "/services", label: "Services" },
];

const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 h-screen bg-white border-r border-gray-200 shadow-lg hidden sm:flex sm:flex-col">
      <div className="w-full h-32 flex justify-center items-center">
        <img 
          src={new_logo} 
          alt="AREA Logo" 
          className="w-full h-auto object-contain"
        />
      </div>
      <ul className="flex-1 px-5">
        {links.map(({ path, label }) => (
          <li key={path} className="mb-2">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `block py-2 px-4 rounded transition-colors duration-200 ${
                  isActive
                    ? "bg-[#EDEEF1] text-[#5A6ACF] font-bold"
                    : "text-[#273240] hover:bg-[#EDEEF1] hover:text-[#5A6ACF]"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
