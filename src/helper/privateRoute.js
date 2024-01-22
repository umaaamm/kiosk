import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import AuthContext from './authContext';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [authToken, navigate]);

  return children;
};

export default PrivateRoute;