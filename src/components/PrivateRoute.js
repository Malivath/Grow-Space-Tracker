import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// PrivateRoute component to protect routes
const PrivateRoute = ({ component: Component }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Component /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
