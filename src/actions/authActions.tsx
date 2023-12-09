// authActions.ts
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducer/rootReducer';
import { User } from '../interfaces/Auth/User';
import { AuthAction, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types/authTypes';
import { AuthService } from '../services/Auth/AuthService';
import { CustomAuthError } from '../interfaces/Auth/CustomAuthError';

const authService = new AuthService();

export const loginTest =  async (
    email: string,
    password: string
  ): Promise<void>   => {
    console.log(email, password);

  try {
    const result = await authService.loginUser(email, password);
    console.log(result);

    if ('user' in result) {
        
    } else {
      const error = result as CustomAuthError;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }

  }
export const login = (
  email: string,
  password: string
): ThunkAction<void, RootState, unknown, AuthAction> => async (dispatch) => {
  console.log(email, password);

  try {
    const result = await authService.loginUser(email, password);
    console.log(result);

    if ('user' in result) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: result.user as User,
      });
    } else {
      const error = result as CustomAuthError;
      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: error.customMessage || 'Login failed' },
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: 'Unexpected error occurred' },
    });
  }
};
