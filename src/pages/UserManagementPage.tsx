import { Container, Typography, Box, Paper } from '@mui/material';
import { usePermissions } from '@/hooks/usePermissions';
import { People } from '@mui/icons-material';
import { Button } from '@/components/common';

/**
 * User Management Page (Protected - USER_READ permission required)
 * Demonstrates permission-based route protection and UI
 */
const UserManagementPage = () => {
  const { hasPermission, userPermissions } = usePermissions();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <People color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h3" component="h1">
          User Management
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        This page requires USER_READ permission to access.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Access Granted ✅
        </Typography>
        <Typography variant="body2" paragraph>
          You have the USER_READ permission!
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Your Permissions:</strong>
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userPermissions.map((permission) => (
              <Box
                key={permission}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: permission.startsWith('USER_') ? 'success.light' : 'grey.300',
                  color: permission.startsWith('USER_') ? 'success.contrastText' : 'text.primary',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: permission.startsWith('USER_') ? 'bold' : 'normal',
                }}
              >
                {permission}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          User Management Actions
        </Typography>
        <Typography variant="body2" paragraph>
          Actions are disabled based on your permissions:
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button
            variant="primary"
            disabled={!hasPermission('USER_CREATE')}
            title={!hasPermission('USER_CREATE') ? 'Missing USER_CREATE permission' : 'Create a new user'}
          >
            {hasPermission('USER_CREATE') ? '✓' : '🔒'} Create User
          </Button>

          <Button
            variant="primary"
            disabled={!hasPermission('USER_UPDATE')}
            title={!hasPermission('USER_UPDATE') ? 'Missing USER_UPDATE permission' : 'Update user information'}
          >
            {hasPermission('USER_UPDATE') ? '✓' : '🔒'} Update User
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('USER_DELETE')}
            title={!hasPermission('USER_DELETE') ? 'Missing USER_DELETE permission' : 'Delete a user'}
          >
            {hasPermission('USER_DELETE') ? '✓' : '🔒'} Delete User
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('ROLE_ASSIGN')}
            title={!hasPermission('ROLE_ASSIGN') ? 'Missing ROLE_ASSIGN permission' : 'Assign roles to users'}
          >
            {hasPermission('ROLE_ASSIGN') ? '✓' : '🔒'} Assign Roles
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          ✅ Permission-Based Protection Working!
        </Typography>
        <Typography variant="body2">
          This page is protected with:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
          {`<ProtectedRoute requiredPermission="USER_READ">`}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Users without USER_READ permission are redirected to /unauthorized
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserManagementPage;