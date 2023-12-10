import React, { useEffect, useState } from 'react';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
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
import { registerUser } from '../../redux/auth/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const RegisterFormFacade = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth); // Get the entire auth state

  console.log('Real-time Auth State:', authState); // Log the real-time state

  const handleRegister = async () => {
    setLoading(true); // Set loading to true before making the async call
    await registerUser(email, password)(dispatch);
    setLoading(false); // Set loading to false after the async call completes
  };

  // useEffect to monitor changes in authState.registrationError
  useEffect(() => {
    if (authState.registrationError) {
      // Display a pop-up message for the registration error
      toast.error(authState.registrationError.customMessage || 'Registration failed. Please try again.');

      // Optional: Clear the registration error in the state after displaying the message
      dispatch({ type: 'REGISTER_USER_FAILURE', payload: null });
    }
  }, [authState.registrationError, dispatch]);

    // useEffect to redirect to login after successful registration
    useEffect(() => {
      if (authState.user) {
        dispatch({ type: 'REGISTER_USER_FAILURE', payload: null });
        navigate('/login');
      }
    }, [authState.user, navigate]);
  
  const formBuilder = new FormBuilder({ buttonLabel: 'Register' });

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
    .buildForm(handleRegister); // Pass an empty function, as handleSubmit logic is already handled in handleRegister

  return adaptToLayout(
    <>
      <ToastContainer />
      {createAvatar({
        sx: { m: 'auto', mb: 1, bgcolor: 'primary.light' },
        children: <LockOutlined />,
      })}
      {createTypography({ variant: 'h5', children: 'Register' })}
      {form}
      {loading ? (
        <CircularProgress size={25} /> // Centered loading indicator
      ) : null}
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
