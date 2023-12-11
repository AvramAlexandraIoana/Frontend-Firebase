import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomAppBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/">
          Travel App
        </Typography>

        <Button component={Link} to="/user-list" color="inherit">
          User List
        </Button>

        {/* Add more Navbar elements as needed */}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
