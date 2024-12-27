import React from 'react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ role, requiredRole, children }) => {
  const location = useLocation();

  if (role !== requiredRole) {
    // Optionally render a "Not Authorized" page or redirect to login
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
