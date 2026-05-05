import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';

/**
 * Protected route wrapper.
 * Redirects to login if not authenticated or role does not match.
 */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect users who land on the wrong dashboard to their own
    const rolePaths = { CITIZEN: '/citizen', VOLUNTEER: '/volunteer', AUTHORITY: '/authority' };
    return <Navigate to={rolePaths[user.role] || '/'} replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/citizen"
        element={
          <ProtectedRoute requiredRole="CITIZEN">
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute requiredRole="VOLUNTEER">
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority"
        element={
          <ProtectedRoute requiredRole="AUTHORITY">
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
