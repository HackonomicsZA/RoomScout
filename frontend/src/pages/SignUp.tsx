// src/pages/SignUp.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import useCreateMutation from '../hooks/useCreateMutation'; // Import the custom hook

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const { mutate: createUser, isPending, error } = useCreateMutation();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setOpenSnackbar(true);
      return;
    }
    // Create the new user object
    const newUser = { first_name: firstName, last_name: lastName, email, password };

    // Use the custom hook to create the user
    createUser(newUser, {
      onSuccess: async () => {
        setSnackbarMessage("Account created successfully!");
        setButtonDisabled(true); // Disable the button
        setOpenSnackbar(true);

        // Automatically log in the user
        // Assuming there's a login function you can call
        // await loginUser({ email, password });

        // Redirect to login page after a short delay
        setTimeout(() => navigate('/signin'), 2000); // Redirect after 2 seconds
      },
      onError: (error) => {
        console.error("Sign-up failed:", error);
        setSnackbarMessage("Error signing up, please try again.");
        setOpenSnackbar(true);
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            type="text"
            variant="outlined"
            margin="normal"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            type="text"
            variant="outlined"
            margin="normal"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
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
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
              style={{ padding: '0.75rem', backgroundColor: buttonDisabled ? 'gray' : undefined }}
              disabled={isPending || buttonDisabled}
            >
              Sign Up
            </Button>
          </Box>
        </form>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            style={{ marginTop: '1rem', padding: '0.75rem', textTransform: 'none' }}
          >
            Sign Up using Google
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Forgot Password?
            </Typography>
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Already have an account? Sign In
            </Typography>
          </Link>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
