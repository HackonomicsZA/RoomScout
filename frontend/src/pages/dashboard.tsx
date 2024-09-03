// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import based on your AuthContext location

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth(); // Assumes AuthContext provides these

  const handleLogout = async () => {
    try {
      await logout();
      // You might want to redirect the user to the sign-in page after logout
      // For example, using `useNavigate` from `react-router-dom`
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.email}</p>
          <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </>
      ) : (
        <p>You need to sign in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
