import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SearchOff } from '@mui/icons-material';
import { Button } from '@/components/common';

/**
 * Not Found Page (404)
 * Shown when user tries to access a route that doesn't exist
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

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
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <SearchOff sx={{ fontSize: 64, color: 'text.secondary' }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            404 - Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            It might have been moved or deleted.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;