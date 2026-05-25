import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If we are still checking if the user has an existing session token, show a loading spinner
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-chatBg">
        <div className="w-12 h-12 border-4 border-accentColor border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user session is found, redirect straight back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the dashboard cleanly if the user is authenticated
  return children;
};

export default ProtectedRoute;