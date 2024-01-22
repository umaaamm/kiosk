import React, { useState, useEffect } from 'react';
import AuthContext from './authContext';

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Get the initial values from localStorage
    const token = localStorage.getItem('token');

    // Update the state variables
    setAuthToken(token);

    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setAuthToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array, so this effect runs only once

  return (
    <AuthContext.Provider value={{ authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
