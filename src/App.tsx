import { Box, Container, Typography } from '@mui/material';
import ComponentShowcase from './pages/ComponentShowcase';
import { register, login, getCurrentUser } from './interceptors';

// 2. Test Registration
const registerData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'Test@123',
  passwordConfirm: 'Test@123',
  acceptTerms: true
};

register(registerData).then(console.log).catch(console.error);

// 3. Test Login
const loginData = {
  email: 'test@example.com',
  password: 'Test@123'
};
login(loginData).then(console.log).catch(console.error);

// 4. Test Get Current User (after login)
getCurrentUser().then(console.log).catch(console.error);

function App() {
  return (
    <Container maxWidth="lg">
      <ComponentShowcase />
    </Container>
  );
}

export default App;