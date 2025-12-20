import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
} from '@mui/material';
import { Email, Check } from '@mui/icons-material';
import { Button } from '@/components/common';
import { forgotPassword } from '@/interceptors';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth.schemas';

/**
 * Forgot Password Page
 * Request password reset email
 */
const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Check sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Check Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If an account exists with this email, a password reset link has been sent.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please check your inbox and follow the instructions to reset your password.
            </Typography>
            <Button component={Link} to="/auth/login" variant="primary" sx={{ mt: 2 }}>
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Link to Login */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                to="/auth/login"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography variant="body2" color="primary">
                  Back to Login
                </Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;