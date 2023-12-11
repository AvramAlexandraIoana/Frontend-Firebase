// CustomAppBar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const CustomAppBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Travel App</Typography>
        {/* Add more Navbar elements as needed */}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
