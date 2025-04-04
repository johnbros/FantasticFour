import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import your auth hook

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get auth status from context
  const location = useLocation(); // Get current location

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;

};
const UnprotectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute, UnprotectedRoute };