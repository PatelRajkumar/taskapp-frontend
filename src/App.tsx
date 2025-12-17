import { Box, Container, Typography } from '@mui/material';

function App() {
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
          Initial setup complete! 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Next: Implementing authentication and routing...
        </Typography>
      </Box>
    </Container>
  );
}

export default App;