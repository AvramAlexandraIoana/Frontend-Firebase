import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomAppBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Travel App
        </Typography>

        <div style={{ marginLeft: 'auto' }}>
          <Button component={Link} to="/role-list" color="inherit">
            Role List
          </Button>
          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
        </div>

        {/* Add more Navbar elements as needed */}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
