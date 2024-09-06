// src/pages/SignIn.tsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Toolbar,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../contexts/AuthContext";

const images = [
  "https://static.wixstatic.com/media/79582d_931d70c7f1584745924646dba9c2a491~mv2.jpg/v1/fill/w_1115,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/79582d_931d70c7f1584745924646dba9c2a491~mv2.jpg",
  "https://static.wixstatic.com/media/79582d_eb981973b1054a6e90f92b6271a9da67~mv2.jpg/v1/fill/w_1115,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/79582d_eb981973b1054a6e90f92b6271a9da67~mv2.jpg",
  "https://56jorissen.co.za/images/building-tall.jpg",
  "https://campusafrica.co.za/wp-content/uploads/2021/10/49JorissenTheTowersexterior.jpg",
];

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // Navigate to the dashboard on successful login
    } catch (error) {
      console.error("Sign-in failed:", error);
      // Handle error accordingly (e.g., show an error message)
    }
  };

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
    <>
      {/* Header Bar (outside the Container) */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#174180", width: "100%" }}
      >
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography
            variant="h4" // Increased the variant for larger default size
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontSize: "2rem",
              color: "white",
            }} // Center, adjust font size, and make the text white
          >
            <strong>RoomScout</strong>
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Content */}
        <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  onClick={prevSlide}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    color: "white",
                  }}
                >
                  ❮
                </IconButton>
                <IconButton
                  onClick={nextSlide}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    color: "white",
                  }}
                >
                  ❯
                </IconButton>
              </Box>
            </Box>
            <Box flex="1">
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: "#174180" }} // Dark blue text color
              >
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
                  type={showPassword ? "text" : "password"}
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
                <Box mt={2}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#174180",
                      padding: "0.75rem",
                      "&:hover": { backgroundColor: "#133366" },
                    }} // Dark blue with hover effect
                    color="primary"
                    style={{ padding: "0.75rem" }}
                  >
                    Sign In
                  </Button>
                </Box>
              </form>

              <Box mt={2} display="flex" justifyContent="space-between">
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="primary">
                    Forgot Password?
                  </Typography>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="primary">
                    Don't have an account? Sign up
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SignIn;