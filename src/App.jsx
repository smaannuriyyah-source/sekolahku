import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Pendaftaran from './pages/Pendaftaran';
import Dashboard from './pages/Dashboard';
import ArticlesPage from './pages/ArticlesPage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import ArticleDetail from './pages/ArticleDetail';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import DashboardRegistrations from './pages/DashboardRegistrations';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AllPosts from './pages/AllPosts'; // Assuming AllPosts component is in pages directory

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        <Route path="/allpost" element={<AllPosts />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
        <Route path="/dashboard/articles/new" element={<ProtectedRoute><ArticleEditorPage /></ProtectedRoute>} />
        <Route path="/dashboard/articles/edit/:id" element={<ProtectedRoute><ArticleEditorPage /></ProtectedRoute>} />
        <Route path="/dashboard/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/registrations" element={<ProtectedRoute><DashboardRegistrations /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
