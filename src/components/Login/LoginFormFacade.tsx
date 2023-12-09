import React, { useState } from 'react';
import { LockOutlined } from '@mui/icons-material';
import { Box, Avatar, Typography, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FormBuilder from '../FormBuilder/FormBuilder';
import { createAvatar, createTypography, createMuiLink } from '../ComponentFactory/ComponentFactory';
import adaptToLayout from '../Adapter/Adapter';
import withLayout from '../withLayout/withLayout';
import { login, loginTest } from '../../actions/authActions'; // Import your login action
import { AuthService } from '../../services/Auth/AuthService';
import { useDispatch } from 'react-redux'; // Import useDispatch


const LoginFormFacade = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  // LoginFormFacade.tsx
  const handleLogin = async () => {
    try {
      await loginTest(email, password);      // If the login is successful, redirect to the dashboard
      // navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      // Handle other login errors or display a message to the user
    }
  };


  const formBuilder = new FormBuilder({ buttonLabel: 'Login' });

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
            to: '/register',
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
