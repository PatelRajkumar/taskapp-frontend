import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * PublicRoute Props
 */
interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute Component
 * Wrapper for routes that should only be accessible when NOT authenticated
 * Examples: Login, Register, Forgot Password
 * 
 * If user is already authenticated, redirects to dashboard
 * 
 * @example
 * <Route
 *   path="/login"
 *   element={
 *     <PublicRoute>
 *       <LoginPage />
 *     </PublicRoute>
 *   }
 * />
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect while still loading auth state
  if (isLoading) {
    return <>{children}</>;
  }

  // Already authenticated - redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated - render the public page
  return <>{children}</>;
};