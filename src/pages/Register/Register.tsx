import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink, // Importing Link as MuiLink to avoid naming conflicts
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Your Register logic goes here
    // For now, let's just log the email and password
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // Center the content vertically
            height: "100vh", // Use 100% of the viewport height
          }}
        >
          <Box
            sx={{
              width: "100%", // Use 100% of the width available,
              bgcolor: "white",
              p: 4,
              borderRadius: 8,
              boxShadow: 4,
              textAlign: "center", // Center the content horizontally
            }}
          >
            {/* Move the Avatar component inside this Box */}
            <Avatar sx={{ m: "auto", mb: 1, bgcolor: "primary.light" }}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5">Register</Typography>
            <ValidatorForm onSubmit={handleRegister} instantValidate={true}>
              <TextValidator
                fullWidth
                variant="outlined"
                margin="normal"
                label="Email Address"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                name="email"
                value={email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
              />
              <TextValidator
                fullWidth
                variant="outlined"
                margin="normal"
                label="Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                validators={[
                  'required',
                  'minStringLength:8',
                  'maxStringLength:20',
                  'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$',
                ]}
                errorMessages={[
                  'This field is required',
                  'Password must be at least 8 characters long',
                  'Password must be at most 20 characters long',
                  'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
                ]}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: 20 }}
              >
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  {/* Applying styles to the link */}
                  <MuiLink
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    color="primary"
                    underline="hover"
                  >
                   Already have an account? Login
                  </MuiLink>
                </Grid>
              </Grid>
            </ValidatorForm>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Register;
