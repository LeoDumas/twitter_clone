import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePocketBase } from "../hooks/usePocketBase";

const Navbar: React.FC = () => {
  const { currentUser } = usePocketBase();
  const [showSettingsBox, setShowSettingsBox] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close the settings box if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowSettingsBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-white text-xl font-bold">
          Twitter-clone
        </Link>
        <div className="relative">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <img
                src={
                  currentUser?.avatar
                    ? `${
                        import.meta.env.VITE_POCKETBASE_URL
                      }api/files/_pb_users_auth_/${currentUser.id}/${
                        currentUser.avatar
                      }`
                    : `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${currentUser.username}`
                }
                alt={`${currentUser.username}'s avatar`}
                className="relative w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setShowSettingsBox(!showSettingsBox)}
              />
              <span className="text-white">
                <span className="text-white/50">@</span>
                {currentUser.username}
              </span>
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
          {showSettingsBox && (
            <SettingsBox
              ref={boxRef}
              onClose={() => setShowSettingsBox(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

interface SettingsBoxProps {
  onClose: () => void;
}

const SettingsBox = React.forwardRef<HTMLDivElement, SettingsBoxProps>(
  ({ onClose }, ref) => {
    const { pb, currentUser } = usePocketBase();
    const navigate = useNavigate();

    const handleLogout = () => {
      pb.authStore.clear();
      navigate("/signin");
      onClose();
    };

    const handleAccountSettings = () => {
      navigate("/account-settings");
      onClose();
    };

    return (
      <div
        ref={ref}
        className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-64"
      >
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              currentUser?.avatar
                ? `${
                    import.meta.env.VITE_POCKETBASE_URL
                  }api/files/_pb_users_auth_/${currentUser.id}/${
                    currentUser.avatar
                  }`
                : `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${currentUser?.username}`
            }
            alt={`${currentUser?.username}'s avatar`}
            className="w-20 h-20 rounded-full mb-2"
          />
          <span className="text-xl font-semibold">
            <span className="text-gray-500">@</span>
            {currentUser?.username}
          </span>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleAccountSettings}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            Account Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
);

export default Navbar;
