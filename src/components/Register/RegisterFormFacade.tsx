import React, { useState } from 'react';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Grid } from '@mui/material';
import FormBuilder from '../FormBuilder/FormBuilder';
import {
  createAvatar,
  createButton,
  createMuiLink,
  createTypography,
} from '../ComponentFactory/ComponentFactory';
import adaptToLayout from '../Adapter/Adapter';
import withLayout from '../withLayout/withLayout';
import { AuthService } from '../../services/Auth/AuthService';
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterFormFacade = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<CustomAuthError | null>(null);

  const authService = new AuthService();
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleRegister = async () => {
    try {
      const result = await authService.registerUser(email, password);

      if ('user' in result) {
        console.log('User registered:', result.user);
        setError(null);
        toast.success(`Registration successful for ${email}!`);

        // Redirect to the login page after successful registration
       navigate('/login'); 
      } else {
        console.error('Registration error code:', result.code);
        setError(result);
        toast.error(result.customMessage || `Registration failed for ${email}. Please try again.`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const formBuilder = new FormBuilder();

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
    .buildForm(handleRegister);

  return adaptToLayout(
    <>
      <ToastContainer />
      {createAvatar({
        sx: { m: 'auto', mb: 1, bgcolor: 'primary.light' },
        children: <LockOutlined />,
      })}
      {createTypography({ variant: 'h5', children: 'Register' })}
      {form}
      {createButton({
        type: 'submit',
        fullWidth: true,
        variant: 'contained',
        sx: { mt: 3, mb: 2, borderRadius: 20 },
        children: 'Register',
        onClick: handleRegister,
      })}
      <Grid container justifyContent="flex-end">
        <Grid item>
          {createMuiLink({
            component: RouterLink,
            to: '/login',
            variant: 'body2',
            color: 'primary',
            underline: 'hover',
            children: 'Already have an account? Login',
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default withLayout(RegisterFormFacade);
