import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, CircularProgress, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { DecodedToken } from '../../interfaces/Auth/DecodedToken';
import CustomAppBar from '../AppBar/CustomAppBar';

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

  return (
    <>
      <CustomAppBar/>
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
            <Typography variant="h4" gutterBottom>
              Welcome, {user.email}!
            </Typography>
            <Typography variant="body1" paragraph>
              Your User ID: {user.sub}
            </Typography>
            {/* Add more user information here as needed */}
            <Link component="button" variant="body2" onClick={() => navigate('/logout')}>
              Logout
            </Link>
          </>
        ) : (
          <Typography variant="body1">No user is signed in.</Typography>
        )}
      </Grid>
    </>
  );
};

export default Profile;
