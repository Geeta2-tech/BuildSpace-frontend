import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useWorkspaces();
  const location = useLocation();

  // While the context is loading the user's status, show a loading indicator
  // to prevent a flash of the login page before the user is confirmed.
  if (loading || currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* You can replace this with a more sophisticated spinner component */}
        <p>Loading...</p>
      </div>
    );
  }

  // If loading is finished and there is no current user, redirect to the login page.
  // We also pass the original location in the state so we can redirect back after login.
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a user is logged in, render the child component (the protected page).
  return children;
};

export default ProtectedRoute;
