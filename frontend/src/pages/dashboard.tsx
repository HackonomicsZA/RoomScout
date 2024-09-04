// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth(); 
  const handleLogout = async () => {
    try {
      await logout();
      // After logout delete the token from local storage and redirect to the sign-in page
    
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.first_name}  {currentUser.last_name}</p>
          <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </>
      ) : (
        <p>You need to sign in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
