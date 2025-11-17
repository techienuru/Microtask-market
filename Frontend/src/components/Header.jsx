import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthProvider.jsx";

export const Header = () => {
  // const { currentUser, logout } = useAuth();

  const currentUser = { name: "John Doe", trusted: false };
  const logout = async () => {
    // Mock logout function
    return Promise.resolve();
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobBridge
        </Link>

        <nav className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Tasks
              </Link>
              <Link
                to="/post"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Post Job
              </Link>

              {/* User Profile Pill */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
                  aria-label={`Profile for ${currentUser.name}`}
                >
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  {currentUser.trusted && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Trusted
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
