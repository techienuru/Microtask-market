import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { Home } from "./pages/Home.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { PostTask } from "./pages/PostTask.jsx";
import { TaskDetailPage } from "./pages/TaskDetailPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { ManagerPage } from "./pages/ManagerPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { useAppState } from "./hooks/useAppState.js";

function App() {
  const { state } = useAppState();
  const currentUser = state.users.find((u) => u.id === state.currentUserId);

  // Check if user is authenticated (has a current user)
  const isAuthenticated = !!currentUser;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route
          path="/tasks/*"
          element={
            isAuthenticated ? (
              <Layout currentUser={currentUser}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post" element={<PostTask />} />
                  <Route path="/task/:id" element={<TaskDetailPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/manager" element={<ManagerPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Layout>
            ) : (
              <HomePage />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
