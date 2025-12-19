import { Routes, Route } from 'react-router-dom';
import ComponentShowcase from './pages/ComponentShowcase';
import AuthTestPage from './pages/AuthTestPage';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
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
          Phase 2 Complete! 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          AuthContext and useAuth hook are ready!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/auth-test"
            variant="contained"
            size="large"
          >
            Test Auth Context
          </Button>
          <Button
            component={Link}
            to="/showcase"
            variant="outlined"
            size="large"
          >
            View Components
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/showcase" element={<ComponentShowcase />} />
      <Route path="/auth-test" element={<AuthTestPage />} />
    </Routes>
  );
}

export default App;