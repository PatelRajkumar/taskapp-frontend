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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Check,
  Close,
} from '@mui/icons-material';
import { Button, Alert } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schemas';

/**
 * Register Page
 * User registration with comprehensive validation
 */
const RegisterPage = () => {
  const { register: registerUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false,
      subscribeToNewsletter: false,
    },
  });

  const password = watch('password');

  // Password strength indicators
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
    { label: 'One number', test: (pw: string) => /[0-9]/.test(pw) },
    { label: 'One special character (@#$%^&+=)', test: (pw: string) => /[@#$%^&+=]/.test(pw) },
    { label: 'No whitespace', test: (pw: string) => !/\s/.test(pw) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await registerUser(data);
      setSuccess(true);
      // Navigation to login page handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
              Registration Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Please check your email to verify your account before signing in.
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
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join TaskApp to manage your projects efficiently
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
              )}
            />

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
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Password Requirements Indicator */}
            {password && password.length > 0 && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Password requirements:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {passwordRequirements.map((req, index) => {
                    const isValid = req.test(password);
                    return (
                      <ListItem key={index} sx={{ py: 0, px: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {isValid ? (
                            <Check sx={{ fontSize: 16, color: 'success.main' }} />
                          ) : (
                            <Close sx={{ fontSize: 16, color: 'error.main' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={req.label}
                          primaryTypographyProps={{
                            variant: 'caption',
                            color: isValid ? 'success.main' : 'text.secondary',
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}

            {/* Confirm Password Field */}
            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  fullWidth
                  margin="normal"
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm?.message}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Accept Terms Checkbox */}
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={isLoading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I accept the{' '}
                      <Link to="/terms" style={{ color: 'inherit', fontWeight: 'bold' }}>
                        Terms and Conditions
                      </Link>
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
              )}
            />
            {errors.acceptTerms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4 }}>
                {errors.acceptTerms.message}
              </Typography>
            )}

            {/* Newsletter Checkbox */}
            <Controller
              name="subscribeToNewsletter"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={isLoading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Subscribe to newsletter for updates and tips
                    </Typography>
                  }
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            {/* Link to Login */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
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

export default RegisterPage;