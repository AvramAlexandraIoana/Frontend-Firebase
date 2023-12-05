import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';

const adaptToLayout = (component: React.ReactNode): React.ReactElement  => {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
    </Container>
  );
};

export default adaptToLayout;