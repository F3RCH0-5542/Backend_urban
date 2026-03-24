
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/pqrs" replace />;
    }
    return <Navigate to="/pqrs" replace />;
  }

  return children;
};


ProtectedRoute.propTypes = {
  children:     PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredRole: null,
};

export default ProtectedRoute;