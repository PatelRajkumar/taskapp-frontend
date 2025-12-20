import { useAuth } from './useAuth';

/**
 * Custom hook to access permission checking utilities
 * 
 * @example
 * function UserManagement() {
 *   const { hasPermission, userPermissions } = usePermissions();
 *   
 *   if (!hasPermission("USER_READ")) {
 *     return <UnauthorizedPage />;
 *   }
 *   
 *   return (
 *     <div>
 *       <UserTable />
 *       <Button disabled={!hasPermission("USER_CREATE")}>
 *         Create User
 *       </Button>
 *       <Button disabled={!hasPermission("USER_DELETE")}>
 *         Delete User
 *       </Button>
 *     </div>
 *   );
 * }
 */
export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, userPermissions } = useAuth();

  return {
    /**
     * Check if user has a specific permission
     * @param permission - Permission code (e.g., "USER_CREATE")
     * @returns true if user has the permission
     */
    hasPermission,

    /**
     * Check if user has any of the specified permissions (OR logic)
     * @param permissions - Array of permission codes
     * @returns true if user has at least one permission
     */
    hasAnyPermission,

    /**
     * Check if user has all of the specified permissions (AND logic)
     * @param permissions - Array of permission codes
     * @returns true if user has all permissions
     */
    hasAllPermissions,

    /**
     * Array of user's permission codes
     */
    userPermissions,
  };
};