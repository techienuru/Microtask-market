import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, User, Settings, Shield } from "lucide-react";

export const Layout = ({ children, currentUser }) => {
  const location = useLocation();

  const navItems = [
    { path: "/tasks", icon: Home, label: "Home" },
    { path: "/tasks/post", icon: Plus, label: "Post" },
    { path: `/profile/${currentUser?.id}`, icon: User, label: "Profile" },
    { path: "/manager", icon: Settings, label: "Manager" },
    { path: "/admin", icon: Shield, label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/tasks" className="text-xl font-bold text-blue-600">
            MicroTask
          </Link>
          {currentUser && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{currentUser.name}</span>
              {currentUser.trusted && (
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Trusted
                </span>
              )}
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                onClick={() => {
                  localStorage.removeItem("rememberUser");
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
