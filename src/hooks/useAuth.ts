import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Custom hook to access authentication context
 * 
 * @throws Error if used outside AuthProvider
 * 
 * @example
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Please login</div>;
 *   }
 *   
 *   return <div>Welcome, {user.name}!</div>;
 * }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};