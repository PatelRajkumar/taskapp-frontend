import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute Props
 */
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
}

/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication and specific permissions
 * 
 * @example Basic protection (authentication only)
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 * 
 * @example With single permission requirement
 * <Route
 *   path="/users/create"
 *   element={
 *     <ProtectedRoute requiredPermission="USER_CREATE">
 *       <CreateUserPage />
 *     </ProtectedRoute>
 *   }
 * />
 * 
 * @example With multiple permissions (user must have at least one - OR logic)
 * <Route
 *   path="/management"
 *   element={
 *     <ProtectedRoute requiredPermissions={["PROJECT_MANAGE", "TASK_ASSIGN"]}>
 *       <ManagementPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredPermissions,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permission requirements if specified
  if (requiredPermission || requiredPermissions) {
    // Check single required permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check multiple required permissions (user must have at least one - OR logic)
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
};