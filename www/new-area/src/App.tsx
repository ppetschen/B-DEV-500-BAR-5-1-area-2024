import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./page/auth/LoginPage";
import SignupPage from "./page/auth/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<div className="flex items-center text-3xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
