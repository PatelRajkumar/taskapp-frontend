import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Box, Paper, Typography, CircularProgress } from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { Button } from '@/components/common';
import { verifyEmail } from '@/interceptors';

/**
 * Email Verification Page
 * Verifies user email with token from URL
 * Route: /auth/verify-email?token=xyz
 */
const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setError('Invalid verification link. No token provided.');
                setIsLoading(false);
                return;
            }

            try {
                await verifyEmail({ token });
                setSuccess(true);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Verification failed. The link may have expired.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [searchParams]);

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <CircularProgress size={64} sx={{ mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Verifying Your Email...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please wait while we verify your email address.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        );
    }

    if (success) {
        return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Email Verified!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Your email has been verified successfully.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            You can now sign in to your account.
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
                }}
            >
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Verification Failed
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {error}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                        <Button component={Link} to="/auth/resend-verification" variant="outlined">
                            Resend Verification Email
                        </Button>
                        <Button component={Link} to="/auth/login" variant="primary">
                            Go to Login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;