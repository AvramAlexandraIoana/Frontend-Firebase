// LoginFormFacade.tsx
import React, { useState } from 'react';
import { LockOutlined } from '@mui/icons-material';
import { Box, Avatar, Typography, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FormBuilder from '../FormBuilder/FormBuilder';
import { createAvatar, createButton, createMuiLink, createTypography } from '../ComponentFactory/ComponentFactory';
import adaptToLayout from '../Adapter/Adapter';
import withLayout from '../withLayout/withLayout';

const LoginFormFacade = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formBuilder = new FormBuilder({ buttonLabel: 'Login' });

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const form = formBuilder
    .addTextField({
      label: 'Email Address',
      name: 'email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      validators: ['required', 'isEmail'],
      errorMessages: ['This field is required', 'Email is not valid'],
    })
    .addTextField({
      label: 'Password',
      name: 'password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      type: 'password',
      showPassword: showPassword,
      onChangeToggle: () => setShowPassword(!showPassword),
      validators: [
        'required',
        'minStringLength:8',
        'maxStringLength:20',
        'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$',
      ],
      errorMessages: [
        'This field is required',
        'Password must be at least 8 characters long',
        'Password must be at most 20 characters long',
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      ],
    })
    .buildForm(handleLogin);

  return adaptToLayout(
    <>
      {createAvatar({ sx: { m: 'auto', mb: 1, bgcolor: 'primary.light' }, children: <LockOutlined /> })}
      {createTypography({ variant: 'h5', children: 'Login' })}
      {form}
      <Grid container justifyContent="flex-end">
        <Grid item>
          {createMuiLink({
            component: RouterLink,
            to: '/login',
            variant: 'body2',
            color: 'primary',
            underline: 'hover',
            children: "Don't have an account? Register",
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default withLayout(LoginFormFacade);
