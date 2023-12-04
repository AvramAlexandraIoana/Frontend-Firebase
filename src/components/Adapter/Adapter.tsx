// src/components/Adapter/Adapter.tsx
import React from 'react';
import { Box } from '@mui/material';

const adaptToLayout = (component: React.ReactNode): React.ReactNode => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <Box
      sx={{
        width: '100%',
        bgcolor: 'white',
        p: 4,
        borderRadius: 8,
        boxShadow: 4,
        textAlign: 'center',
      }}
    >
      {component}
    </Box>
  </Box>
);

export default adaptToLayout;
