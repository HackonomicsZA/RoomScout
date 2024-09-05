// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import StudentAccommodation from './StudentAccommodation';
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
    <>
      <h1>Dashboard</h1>
      <StudentAccommodation />
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.first_name}  {currentUser.last_name}</p>
          <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </>
      ) : (
        <p>You need to sign in to access the dashboard.</p>
      )}
    </>
  );
};

export default Dashboard;
