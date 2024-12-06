import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If the user doesn't have the required role, redirect to login
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
