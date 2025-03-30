// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize authToken (usually safe)
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

  // Initialize user SAFELY
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        return JSON.parse(storedUser); // Try to parse
      }
      return null; // No stored user
    } catch (error) {
      // If parsing fails (e.g., corrupted data)
      console.error("AuthProvider: Failed to parse stored user from localStorage.", error);
      // Attempt to remove the corrupted item so it doesn't cause issues again
      try {
          localStorage.removeItem('authUser');
      } catch(removeError) {
          console.error("AuthProvider: Failed to remove corrupted authUser from localStorage.", removeError);
      }
      return null; // Default to null if parsing fails
    }
  });

  // Login/Logout functions remain the same...
  const login = (token, userData) => {
    try {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    } catch (error) {
        console.error("AuthProvider: Failed during login localStorage operation.", error)
        // Handle potential storage errors (e.g., quota exceeded)
    }
  };

  const logout = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setAuthToken(null);
        setUser(null);
    } catch (error) {
        console.error("AuthProvider: Failed during logout localStorage operation.", error)
    }
  };

  const isAuthenticated = !!authToken;

  const value = {
    authToken,
    user,
    isAuthenticated,
    login,
    logout,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};