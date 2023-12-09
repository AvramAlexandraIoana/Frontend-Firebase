// authReducer.ts
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import { User } from '../../interfaces/Auth/User';
import { AuthActionTypes } from './authActions';

interface AuthState {
  user: User | null;
  error: CustomAuthError | null;
}

const initialState: AuthState = {
  user: null,
  error: null,
};

const authReducer = (state: AuthState = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case 'REGISTER_USER_SUCCESS':
    case 'LOGIN_USER_SUCCESS':
      return { ...state, user: action.payload, error: null };

    case 'REGISTER_USER_FAILURE':
    case 'LOGIN_USER_FAILURE':
      return { ...state, user: null, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
