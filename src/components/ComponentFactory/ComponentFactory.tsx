// ComponentFactory.tsx
import React from 'react';
import { Link as MuiLink, Button, Avatar, Typography } from '@mui/material';

const createMuiLink = (props: any) => {
  return <MuiLink {...props} />;
};

const createButton = (props: any) => {
  return <Button {...props} />;
};

const createAvatar = (props: any) => {
  return <Avatar {...props} />;
};

const createTypography = (props: any) => {
  return <Typography {...props} />;
};

export { createMuiLink, createButton, createAvatar, createTypography };
