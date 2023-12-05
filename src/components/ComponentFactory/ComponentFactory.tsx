// ComponentFactory.tsx
import React from 'react';
import { Link as MuiLink, Button } from '@mui/material';

const createMuiLink = (props: any) => {
  return <MuiLink {...props} />;
};

const createButton = (props: any) => {
  return <Button {...props} />;
};

export { createMuiLink, createButton };
