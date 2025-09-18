import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { PostTask } from './pages/PostTask.jsx';
import { TaskDetailPage } from './pages/TaskDetailPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ManagerPage } from './pages/ManagerPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { useAppState } from './hooks/useAppState.js';

function App() {
  const { state } = useAppState();
  const currentUser = state.users.find(u => u.id === state.currentUserId);

  return (
    <Router>
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
    </Router>
  );
}

export default App;