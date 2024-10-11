import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "./page/auth/LoginPage";
import SignupPage from "./page/auth/SignupPage";
import Layout from "./components/layout/layout/layout";
import Dashboard from "./page/DashboardPage";
import CreateAreaPage from "./page/AutomationPage";
import ServicesPage from "./page/servicesPage";
import "../src/style/styles.css";
import MenuPage from "./page/MenuPage";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("currentUser");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/current-area" element={<CreateAreaPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<ServicesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
