import React, { useEffect, useState } from 'react';
import { Avatar, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import CustomAppBar from '../AppBar/CustomAppBar';
import { createButton } from '../ComponentFactory/ComponentFactory';
import { DecodedToken } from '../../interfaces/Auth/DecodedToken';

const Profile = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode(token) as DecodedToken | null;

        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token from localStorage on logout
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <CustomAppBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 64px)" // Subtract the height of the AppBar
      >
        {loading ? (
          <CircularProgress size={50} />
        ) : user ? (
          <>
            <Avatar alt={user.email}  sx={{ width: 100, height: 100, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Welcome, {user.email}!
            </Typography>
            <Typography variant="body1" paragraph>
              Your User ID: {user.sub}
            </Typography>
            {/* Add more user information here as needed */}
            {createButton({
              type: 'submit',
              fullWidth: false,
              variant: 'contained',
              sx: { borderRadius: 20, mt: 3 },
              children: 'Logout',
              onClick: handleLogout
            })}
          </>
        ) : (
          <Typography variant="body1">No user is signed in.</Typography>
        )}
      </Grid>
    </>
  );
};

export default Profile;
