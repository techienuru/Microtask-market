import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/api.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const user = await auth.me();
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      setCurrentUser(null);
      // Clear any stale auth state on 401
      if (err.status === 401) {
        // Clear any potential stale cookies by calling logout
        try {
          await auth.logout();
        } catch (logoutErr) {
          // Ignore logout errors during auth check
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      setCurrentUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      // Don't auto-login after registration, user needs to verify OTP
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setCurrentUser(null);
      setError(null);
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (err) {
      // Even if logout fails on server, clear local state
      setCurrentUser(null);
      console.error("Logout error:", err);
    }
  };

  const requestOtp = async (identifier) => {
    try {
      const response = await auth.requestOtp(identifier);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyOtp = async (identifier, otp) => {
    try {
      const response = await auth.verifyOtp(identifier, otp);
      setCurrentUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    requestOtp,
    verifyOtp,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Route protection component
export const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (!currentUser) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="max-w-md w-full text-center p-6">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //           Authentication Required
  //         </h2>
  //         <p className="text-gray-600 mb-6">
  //           Please log in to access this page.
  //         </p>
  //         <div className="space-y-3">
  //           <a
  //             href="/login"
  //             className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
  //           >
  //             Log In
  //           </a>
  //           <a
  //             href="/signup"
  //             className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
  //           >
  //             Sign Up
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return children;
};
