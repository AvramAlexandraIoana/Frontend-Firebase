// authReducer.ts
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import { User } from '../../interfaces/Auth/User';
import { AuthActionTypes } from './authActions';

interface AuthState {
  user: User | null;
  registrationError: CustomAuthError | null;
  loginError: CustomAuthError | null;
}

const initialState: AuthState = {
  user: null,
  registrationError: null,
  loginError: null,
};

const authReducer = (state: AuthState = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case 'REGISTER_USER_SUCCESS':
      return { ...state, user: action.payload, registrationError: null };

    case 'REGISTER_USER_FAILURE':
      return { ...state, user: null, registrationError: action.payload, loginError: null };

    case 'LOGIN_USER_SUCCESS':
      return { ...state, user: action.payload, loginError: null };

    case 'LOGIN_USER_FAILURE':
      return { ...state, user: null, loginError: action.payload, registrationError: null };

    default:
      return state;
  }
};

export default authReducer;
