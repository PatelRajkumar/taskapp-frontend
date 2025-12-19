import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Button,
  Input,
  FormField,
  Card,
  LoadingButton,
  Alert,
} from '@/components/common';

/**
 * ComponentShowcase - Interactive demo page to test all common components
 * Access at: http://localhost:3000/showcase
 */
const ComponentShowcase = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Component Showcase
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Interactive demo of all common components used in TaskApp
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Buttons Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Buttons
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Various button styles and states
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Button Variants
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Button States
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Full Width Button
              </Typography>
              <Button variant="primary" fullWidth>
                Full Width Button
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                LoadingButton with Click
              </Typography>
              <LoadingButton
                variant="primary"
                loading={loading}
                onClick={handleLoadingClick}
                fullWidth
              >
                {loading ? 'Loading...' : 'Click me to see loading'}
              </LoadingButton>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Inputs Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Inputs
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Text input fields with various types
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Inputs
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input
                  type="text"
                  label="Name"
                  placeholder="Enter your name"
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Input States
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input
                  label="Normal"
                  placeholder="Normal input"
                />
                <Input
                  label="Disabled"
                  placeholder="Disabled input"
                  disabled
                />
                <Input
                  label="Error"
                  placeholder="Error input"
                  error
                  helperText="This field is required"
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Multiline Input
              </Typography>
              <Input
                label="Description"
                placeholder="Enter description"
                multiline
                rows={4}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* FormField Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          FormField
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Wrapper component for form inputs with labels and errors
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Form Fields with Labels
              </Typography>
              <FormField label="Email">
                <Input type="email" placeholder="Enter your email" />
              </FormField>
              <FormField
                label="Password"
                required
                helperText="Must be at least 8 characters"
              >
                <Input type="password" placeholder="Enter password" />
              </FormField>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Form Fields with Errors
              </Typography>
              <FormField label="Email" required error="Invalid email address">
                <Input type="email" error placeholder="test@" />
              </FormField>
              <FormField label="Password" required error="Password is too short">
                <Input type="password" error placeholder="123" />
              </FormField>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Alerts Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Notification alerts with different severity levels
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Alert severity="success" title="Success">
              Your account has been created successfully!
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="error" title="Error">
              Invalid email or password. Please try again.
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="warning" title="Warning">
              Your session will expire in 5 minutes.
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="info" title="Information">
              A new version of the app is available.
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert
              severity="success"
              closable
              open={showAlert}
              onClose={() => setShowAlert(false)}
            >
              This alert can be closed by clicking the X button.
            </Alert>
            {!showAlert && (
              <Button onClick={() => setShowAlert(true)}>
                Show Alert Again
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Cards Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Cards
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Card containers for grouping content
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card title="Basic Card" subtitle="This is a subtitle">
              <Typography variant="body2">
                This is a basic card with a title and subtitle. Cards are used
                to group related content together.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <Typography variant="h6" gutterBottom>
                Card without Header
              </Typography>
              <Typography variant="body2">
                This card doesn't have a predefined header. You can add your
                own content structure inside.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card
              title="Login Form Example"
              subtitle="Enter your credentials"
              showHeader
            >
              <FormField label="Email" required>
                <Input type="email" placeholder="Enter your email" />
              </FormField>
              <FormField label="Password" required>
                <Input type="password" placeholder="Enter password" />
              </FormField>
              <Button variant="primary" fullWidth>
                Sign In
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ComponentShowcase;