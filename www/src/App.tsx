import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from "./page/auth/LoginPage";
import SignupPage from "./page/auth/SignupPage";
import Layout from "./components/layout/Layout";
import Dashboard from "./page/DashboardPage";
import CreateAreaPage from "./page/AutomationPage";
import ServicesPage from "./page/ServicesPage";
import "./style/styles.css";
import MenuPage from "./page/MenuPage";
import Settings from "./page/Settings";
import theme from "./style/theme";
import { ThemeProvider } from "@mui/material/styles";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("currentUser");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/current-area" element={<CreateAreaPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<ServicesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
