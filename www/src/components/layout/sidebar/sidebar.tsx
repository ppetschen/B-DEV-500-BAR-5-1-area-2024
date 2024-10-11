import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/current-area", label: "Automation" },
  { path: "/services", label: "Services" },
];

const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 h-screen p-5 bg-white border-r border-gray-200 shadow-lg">
      <h2 className="p-6 text-3xl font-bold text-[#5A6ACF]">AREA</h2>
      <ul className="space-y-2">
        {links.map(({ path, label }) => (
          <li key={path}>
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
