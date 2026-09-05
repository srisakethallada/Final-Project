import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { authStatus, userProfile, isConfigured } = useAuth();
  const location = useLocation();

  if (authStatus === 'LOADING') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <LoadingSpinner label="Authenticating session..." />
      </div>
    );
  }

  // If Supabase is not yet configured, allow demo access so application stays operational during development
  if (!isConfigured) {
    return children ? <>{children}</> : <Outlet />;
  }

  if (authStatus === 'UNAUTHENTICATED') {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
