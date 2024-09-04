// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  // Add other user properties as needed
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const baseUrl = 'http://localhost:5000';

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);  // Assuming the response contains the user object
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('isSignedIn', 'true');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Optionally handle logout on the server if needed
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isSignedIn');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Initialize state from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (isSignedIn && storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
