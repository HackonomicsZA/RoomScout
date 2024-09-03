// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import Dashboard from './pages/dashboard'; // Make sure you have a Dashboard page
import ForgotPassword from './pages/ForgotPass';
import SignUp from './pages/SignUp';

// ProtectedRoute component defined within App.tsx
const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAuth(); // Use the authentication context

  // If no user is logged in, redirect to the SignIn page
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, render the requested component
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard is protected */}
          </Route>

          {/* Redirect any unknown route to the SignIn */}
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
