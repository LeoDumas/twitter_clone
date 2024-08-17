// components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePocketBase } from "../hooks/usePocketBase";

const Navbar: React.FC = () => {
  const { pb, currentUser } = usePocketBase();
  const navigate = useNavigate();

  const handleLogout = () => {
    pb.authStore.clear();
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-bold">
          MyApp
        </Link>
        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                <span className=" text-white/50">@</span>
                {currentUser.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/signin"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
