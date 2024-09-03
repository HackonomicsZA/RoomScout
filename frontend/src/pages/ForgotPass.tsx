// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send reset link)
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Enter your email to receive a password reset link.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ padding: '0.75rem' }}
            >
              Send Reset Link
            </Button>
          </Box>
        </form>
        <Box mt={2} display="flex" justifyContent="center">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Back to Sign In
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
