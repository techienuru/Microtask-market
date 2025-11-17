import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, RequireAuth } from "./contexts/AuthProvider.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { TasksPage } from "./pages/TasksPage.jsx";
import { PostTaskPage } from "./pages/PostTaskPage.jsx";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

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
              path="/admin"
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-6xl mx-auto px-4 py-6">
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          Admin Panel
                        </h1>
                        <p className="text-gray-600">
                          Not implemented on server yet
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={async () => {
                              try {
                                const { admin } = await import("./lib/api.js");
                                await admin.seed();
                                if (window.showToast) {
                                  window.showToast({
                                    message: "Demo data seeded successfully!",
                                    type: "success",
                                  });
                                }
                              } catch (error) {
                                if (window.showToast) {
                                  window.showToast({
                                    message: `Seed failed: ${error.message}`,
                                    type: "error",
                                  });
                                }
                              }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Seed Demo Data
                          </button>
                        </div>
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
