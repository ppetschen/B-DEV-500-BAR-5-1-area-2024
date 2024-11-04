import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import new_logo from "../../../public/new_logo.png";
import { useAuth } from "../../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/current-area", label: "Automation" },
  { path: "/services", label: "Services" },
];

const profileLinks = [
  { path: "/settings", label: "Settings", icon: <AccountCircleIcon /> },
  { path: "/", label: "Logout", icon: <ExitToAppIcon /> },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-64 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col justify-between">
      <div>
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
                      ? "bg-[#EDEEF1] text-[#5c1ed6] font-bold"
                      : "text-[#273240] hover:bg-[#EDEEF1] hover:text-[#5c1ed6]"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-5 border-t border-gray-200">
        {profileLinks.map(({ path, label, icon }) => (
          <div key={path} className="mb-2">
            {label === "Logout" ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center py-2 px-4 rounded text-[#273240] hover:bg-[#EDEEF1] hover:text-[#5c1ed6] transition-colors duration-200"
              >
                {icon}
                <span className="ml-2">{label}</span>
              </button>
            ) : (
              <NavLink
                to={path}
                className="flex items-center py-2 px-4 rounded text-[#273240] hover:bg-[#EDEEF1] hover:text-[#5c1ed6] transition-colors duration-200"
              >
                {icon}
                <span className="ml-2">{label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
