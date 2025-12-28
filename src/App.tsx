import { Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResendVerificationPage from './pages/auth/ResendVerificationPage';

// Profile Pages
import ProfilePage from './pages/profile/ProfilePage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ProjectManagementPage from './pages/ProjectManagementPage';

// Error Pages
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import { ProjectDetailPage, ProjectListPage } from './pages/projects';
import { IssueListPage } from './pages/issues';

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
          Phase 5 Complete! 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Email Verification + User Profile Management
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
              <Button component={Link} to="/profile" variant="outlined" size="large">
                My Profile
              </Button>
              <Button component={Link} to="/users" variant="outlined" size="large">
                User Management
              </Button>
              <Button component={Link} to="/projects" variant="outlined" size="large">
                Project Management
              </Button>
              <Button component={Link} to="/issues" variant="outlined" size="large">
                Issues
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/auth/login" variant="contained" size="large">
                Login
              </Button>
              <Button component={Link} to="/auth/register" variant="outlined" size="large">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

/**
 * App Component with Complete Route Configuration
 */
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Authentication Routes (redirect to dashboard if already authenticated) */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Email Verification Routes (can be accessed without auth) */}
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/auth/resend-verification"
        element={
          <PublicRoute>
            <ResendVerificationPage />
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

      {/* Profile Route (authentication required) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
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

      {/* Project Routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute requiredPermission="PROJECT_READ">
            <ProjectListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute requiredPermission="PROJECT_READ">
            <ProjectDetailPage />
          </ProtectedRoute>
        }
      />
      {/* Issue Routes */}
      <Route
        path="/issues"
        element={
          <ProtectedRoute>
            <IssueListPage />
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