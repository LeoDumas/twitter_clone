// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { usePocketBase } from "./hooks/usePocketBase";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import HomePage from "./pages/protected/HomePage";
import SettingsPage from "./pages/protected/SettingsPage";

const App: React.FC = () => {
  const { currentUser } = usePocketBase();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route
            path="/signin"
            element={currentUser ? <Navigate to="/home" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/home" /> : <SignUp />}
          />
          <Route
            path="/home"
            element={currentUser ? <HomePage /> : <Navigate to="/signin" />}
          />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/account-settings"
            element={currentUser ? <SettingsPage /> : <Navigate to="/signin" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
