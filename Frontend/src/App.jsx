import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, RequireAuth } from "./contexts/AuthProvider.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import { HomePage } from "./pages/public/HomePage.jsx";
import { LoginPage } from "./pages/public/LoginPage.jsx";
import { SignUpPage } from "./pages/public/SignUpPage.jsx";
import { TasksPage } from "./pages/shared/TasksPage.jsx";
import { PostTaskPage } from "./pages/PostTaskPage.jsx";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";
import { AdminTasks } from "./pages/admin/AdminTasks.jsx";
import { AdminSettings } from "./pages/admin/AdminSettings.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected routes */}

            {/* A. ADMIN */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <AdminDashboard />
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <AdminUsers />
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <AdminTasks />
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <AdminSettings />
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            {/* B. TASK MANAGER */}
            {/* C. POSTER */}
            {/* D. SEEKER */}

            <Route
              path="/tasks"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <TasksPage />
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/post"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <PostTaskPage />
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            {/* Placeholder routes - show "Not implemented" message */}
            <Route
              path="/postings"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          My Postings
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/jobs/mine"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          My Jobs
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/wallet"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          Wallet
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/manager"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          Task Manager
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          Profile
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </RequireAuth>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
