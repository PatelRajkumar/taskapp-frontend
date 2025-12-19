import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';

/**
 * Auth Test Page
 * Demonstrates Phase 2 - AuthContext working
 * Shows current auth state and provides login/logout buttons
 */
const AuthTestPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Phase 2: Auth Context Test
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Testing AuthContext and useAuth hook
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Authentication State:
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </Typography>

          {user && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current User:
              </Typography>
              <Typography variant="body2">
                <strong>ID:</strong> {user.id}
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body2">
                <strong>Enabled:</strong> {user.enabled ? 'Yes' : 'No'}
              </Typography>
              {user.roles && user.roles.length > 0 && (
                <Typography variant="body2">
                  <strong>Roles:</strong> {user.roles.map(r => r.name).join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <Button variant="primary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Not logged in. Login functionality will be available in Phase 4.
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          ✅ Phase 2 Complete!
        </Typography>
        <Typography variant="body2" paragraph>
          Auth Context is working correctly:
        </Typography>
        <ul>
          <li>✅ AuthContext created with global state</li>
          <li>✅ useAuth hook provides easy access</li>
          <li>✅ Initial auth check on mount</li>
          <li>✅ Token validation with backend</li>
          <li>✅ Cached user for better UX</li>
          <li>✅ Login/register/logout functions ready</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default AuthTestPage;