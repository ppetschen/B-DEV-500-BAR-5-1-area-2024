// src/components/Layout.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./Header";

const Layout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("currentUser");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
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
