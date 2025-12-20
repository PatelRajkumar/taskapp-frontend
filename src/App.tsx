import { Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

// Pages
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Home Page
 */
function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          TaskApp
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Project Management Made Simple
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Phase 3 Complete! 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Permission-Based Access Control (PBAC)
        </Typography>

        {isAuthenticated && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
              Logged in as: {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.permissions?.length || 0} permissions
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {isAuthenticated ? (
            <>
              <Button component={Link} to="/dashboard" variant="contained" size="large">
                Dashboard
              </Button>
              <Button component={Link} to="/users" variant="outlined" size="large">
                User Management
              </Button>
              <Button component={Link} to="/projects" variant="outlined" size="large">
                Project Management
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="contained" size="large">
                Login
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large">
                Register
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

/**
 * Temporary placeholder for Login page
 * Will be replaced with actual LoginPage in Phase 4
 */
function LoginPlaceholder() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Login Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Login page will be implemented in Phase 4.
      </Typography>
      <Button component={Link} to="/" sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Container>
  );
}

/**
 * Temporary placeholder for Register page
 * Will be replaced with actual RegisterPage in Phase 4
 */
function RegisterPlaceholder() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Register Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Register page will be implemented in Phase 4.
      </Typography>
      <Button component={Link} to="/" sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Container>
  );
}

/**
 * App Component with Permission-Based Route Configuration
 */
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Public Routes (redirect to dashboard if authenticated) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPlaceholder />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPlaceholder />
          </PublicRoute>
        }
      />

      {/* Protected Routes (authentication required only) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes (permission-based) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredPermission="USER_READ">
            <UserManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute requiredPermission="PROJECT_READ">
            <ProjectManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;