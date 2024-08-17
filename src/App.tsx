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
import SignIn from "./components/SignIn";
import SignUp from "./components/Signup";
import Dashboard from "./components/DashBoard";

const App: React.FC = () => {
  const { currentUser } = usePocketBase();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route
            path="/signin"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />}
          />
          <Route
            path="/dashboard"
            element={currentUser ? <Dashboard /> : <Navigate to="/signin" />}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
