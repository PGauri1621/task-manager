import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TaskListPage from './pages/TaskListPage';
import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/tasks" element={<ProtectedRoute><TaskListPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
