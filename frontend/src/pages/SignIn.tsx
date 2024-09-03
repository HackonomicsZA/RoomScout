// src/pages/SignIn.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { Link } from 'react-router-dom';
// Array of images for the slideshow
const images = [
  'https://static.wixstatic.com/media/79582d_931d70c7f1584745924646dba9c2a491~mv2.jpg/v1/fill/w_1115,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/79582d_931d70c7f1584745924646dba9c2a491~mv2.jpg',
  'https://static.wixstatic.com/media/79582d_eb981973b1054a6e90f92b6271a9da67~mv2.jpg/v1/fill/w_1115,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/79582d_eb981973b1054a6e90f92b6271a9da67~mv2.jpg',
  'https://56jorissen.co.za/images/building-tall.jpg',
  'https://campusafrica.co.za/wp-content/uploads/2021/10/49JorissenTheTowersexterior.jpg',
  // Add more image URLs or paths to your assets here
];

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  // Function to navigate through slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  
  useEffect(() => {
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex="1" marginRight="1rem">
            <Box
              position="relative"
              height="400px" 
              overflow="hidden"
              borderRadius="8px"
            >
              <img
                src={images[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                onClick={prevSlide}
                style={{ position: 'absolute', top: '50%', left: '10px', color: 'white' }}
              >
                ❮
              </IconButton>
              <IconButton
                onClick={nextSlide}
                style={{ position: 'absolute', top: '50%', right: '10px', color: 'white' }}
              >
                ❯
              </IconButton>
            </Box>
          </Box>
          <Box flex="1">
            <Typography variant="h4" align="center" gutterBottom>
              Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
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
                  style={{ padding: '0.75rem' }}
                >
                  Sign In
                </Button>
              </Box>
            </form>
            
            <Box mt={2} display="flex" justifyContent="space-between">
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Forgot Password?
                </Typography>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
