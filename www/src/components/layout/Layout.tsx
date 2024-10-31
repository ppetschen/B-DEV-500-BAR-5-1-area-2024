// src/components/Layout.tsx
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProfileSidebar from "./profileSidebar";

const Layout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("currentUser");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isProfilePage = location.pathname.startsWith("/profile");

  return (
    <div className="flex h-screen">
      {isProfilePage ? <ProfileSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 bg-[#F7F7F9] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
