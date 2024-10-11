import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './page/auth/AuthContext';
import LoginPage from './page/auth/LoginPage';
import SignupPage from './page/auth/SignupPage';
import Layout from './components/layout/layout/layout';
import CurrentAreaPage from './page/sidebar/currentAreaPage'
import CreateAreaPage from './page/sidebar/createArea/createAreaPage';
import ServicesPage from './page/sidebar/createArea/servicesPage';
import '../src/style/styles.css'

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('currentUser');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<CreateAreaPage />} />
              <Route path="/current-area" element={<CurrentAreaPage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
