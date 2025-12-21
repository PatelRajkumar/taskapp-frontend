import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Container, Box, Paper, Typography, TextField } from '@mui/material';
import { Email, Check } from '@mui/icons-material';
import { Alert, Button } from '@/components/common';
import { resendVerification } from '@/interceptors';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth.schemas';

/**
 * Resend Verification Email Page
 * Allows users to request a new verification email
 */
const ResendVerificationPage = () => {
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
      await resendVerification({ email: data.email });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send verification email. Please try again.'
      );
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
              Verification Email Sent!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We've sent a verification link to your email address.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please check your inbox and click the link to verify your account.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If you don't see the email, check your spam folder.
            </Typography>
            <Button component={Link} to="/auth/login" variant="primary" sx={{ mt: 2 }}>
              Go to Login
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
              Resend Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address to receive a new verification link.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" closable onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Form */}
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
              loading={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </Button>

            {/* Links */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already verified?{' '}
                <Link to="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Sign in
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResendVerificationPage;