// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentAccommodation from './StudentAccommodation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Filter from './Filter';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      window.localStorage.removeItem('authToken'); // Adjust the key as needed
      navigate('/signin'); // Redirect to the sign-in page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Button onClick={() => navigate('/Filter')} variant="contained" color="primary" style={{ margin: '10px' }}>
        Filter
      </Button>
      <Button onClick={handleLogout} variant="contained" color="secondary" style={{ margin: '10px' }}>
        Logout
      </Button>
      <StudentAccommodation />
    </div>
  );
};

export default Dashboard;
