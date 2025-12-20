import { Container, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/common';

/**
 * Dashboard Page (Protected)
 * Main landing page after login
 * Demonstrates permission-based UI rendering
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { hasPermission, userPermissions } = usePermissions();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your dashboard, {user?.name}!
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          User Information
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>ID:</strong> {user?.id}
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {user?.name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body2">
            <strong>Enabled:</strong> {user?.enabled ? 'Yes' : 'No'}
          </Typography>
          {user?.roles && user.roles.length > 0 && (
            <Typography variant="body2">
              <strong>Roles:</strong> {user.roles.map((r) => r.name).join(', ')}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Permissions ({userPermissions.length})
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {userPermissions.length > 0 ? (
            userPermissions.map((permission) => (
              <Box
                key={permission}
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                {permission}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No permissions assigned
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Permission-Based Actions
        </Typography>
        <Typography variant="body2" paragraph>
          Buttons below are disabled if you don't have the required permission:
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button
            variant="primary"
            disabled={!hasPermission('USER_CREATE')}
            title={!hasPermission('USER_CREATE') ? 'Missing USER_CREATE permission' : ''}
          >
            Create User {!hasPermission('USER_CREATE') && '🔒'}
          </Button>

          <Button
            variant="primary"
            disabled={!hasPermission('PROJECT_CREATE')}
            title={!hasPermission('PROJECT_CREATE') ? 'Missing PROJECT_CREATE permission' : ''}
          >
            Create Project {!hasPermission('PROJECT_CREATE') && '🔒'}
          </Button>

          <Button
            variant="primary"
            disabled={!hasPermission('TASK_CREATE')}
            title={!hasPermission('TASK_CREATE') ? 'Missing TASK_CREATE permission' : ''}
          >
            Create Task {!hasPermission('TASK_CREATE') && '🔒'}
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('USER_DELETE')}
            title={!hasPermission('USER_DELETE') ? 'Missing USER_DELETE permission' : ''}
          >
            Delete User {!hasPermission('USER_DELETE') && '🔒'}
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('SYSTEM_ADMIN')}
            title={!hasPermission('SYSTEM_ADMIN') ? 'Missing SYSTEM_ADMIN permission' : ''}
          >
            System Settings {!hasPermission('SYSTEM_ADMIN') && '🔒'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          ✅ Phase 3 Complete (Permission-Based)!
        </Typography>
        <Typography variant="body2" paragraph>
          Permission-based authorization is working:
        </Typography>
        <ul>
          <li>✅ ProtectedRoute checks permissions</li>
          <li>✅ PublicRoute for unauthenticated users</li>
          <li>✅ Permission-based UI disabling</li>
          <li>✅ hasPermission() utility</li>
          <li>✅ Unauthorized page (403)</li>
          <li>✅ Not Found page (404)</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default DashboardPage;