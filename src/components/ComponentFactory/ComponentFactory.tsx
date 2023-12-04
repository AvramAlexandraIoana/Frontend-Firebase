// src/components/ComponentFactory/ComponentFactory.tsx
import React from 'react';
import { Button, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface MuiLinkProps {
  to: string;
  text: string;
  variant: 'inherit' | 'default' | 'primary' | 'secondary';
  key: string;
}

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  fullWidth: boolean;
  variant: 'text' | 'outlined' | 'contained';
  text: string;
  sx: { [key: string]: any };
}

const createMuiLink = ({ to, text, variant, key }: MuiLinkProps): React.ReactNode => (
  <MuiLink
    key={key}
    component={RouterLink}
    to={to}
    variant="body2"
    color={variant}
    underline="hover"
  >
    {text}
  </MuiLink>
);

const createButton = ({ type, fullWidth, variant, text, sx }: ButtonProps): React.ReactNode => (
  <Button
    key={type}
    type={type}
    fullWidth={fullWidth}
    variant={variant}
    sx={{ mt: 3, mb: 2, borderRadius: 20, ...sx }}
  >
    {text}
  </Button>
);

export { createMuiLink, createButton };
