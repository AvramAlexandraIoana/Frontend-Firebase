// authActions.ts
import { Dispatch } from 'redux';
import { User } from '../../interfaces/Auth/User';
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import {
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
} from './authActionTypes';
import { AuthService } from '../../services/Auth/AuthService'; // Import your authentication service

const authService = new AuthService();

// Action types
interface RegisterUserSuccessAction {
  type: typeof REGISTER_USER_SUCCESS;
  payload: User;
}

interface RegisterUserFailureAction {
  type: typeof REGISTER_USER_FAILURE;
  payload: CustomAuthError;
}

interface LoginUserSuccessAction {
  type: typeof LOGIN_USER_SUCCESS;
  payload: User;
}

interface LoginUserFailureAction {
  type: typeof LOGIN_USER_FAILURE;
  payload: CustomAuthError;
}

export type AuthActionTypes =
  | RegisterUserSuccessAction
  | RegisterUserFailureAction
  | LoginUserSuccessAction
  | LoginUserFailureAction;

// Async action creator for register
export const registerUser = (email: string, password: string) => async (
  dispatch: Dispatch<AuthActionTypes>
) => {
  try {
    // Assuming authService.registerUser returns a User object upon successful registration
    const user = await authService.registerUser(email, password);

    // Dispatch register success action
   // dispatch({ type: REGISTER_USER_SUCCESS, payload: user });
  } catch (error) {
    // If registration fails, dispatch register failure action
    //dispatch({ type: REGISTER_USER_FAILURE, payload: error });
  }
};

export const loginUsertest = async (email: string, password: string) => {
    const user = await authService.loginUser(email, password);
    console.log(user);
}
// Async action creator for login
export const loginUser = (email: string, password: string) => async (
    dispatch: Dispatch<AuthActionTypes>
  ) => {
    console.log('Entering loginUser action');
    try {
      // Assuming authService.loginUser returns a User object upon successful login
      const user = await authService.loginUser(email, password);
  
      console.log('Login Success:', user);
      // Dispatch login success action
      dispatch(loginUserSuccess(user as User));
    } catch (error) {
      console.error('Login Error:', error);
      // If login fails, dispatch login failure action
      dispatch(loginUserFailure(error as CustomAuthError));
    }
  };
  
  
// Sync action creators for register success and failure
export const registerUserSuccess = (user: User): RegisterUserSuccessAction => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});

export const registerUserFailure = (error: CustomAuthError): RegisterUserFailureAction => ({
  type: REGISTER_USER_FAILURE,
  payload: error,
});

// Sync action creators for login success and failure
export const loginUserSuccess = (user: User): LoginUserSuccessAction => ({
    type: LOGIN_USER_SUCCESS,
    payload: user,
});
  
export const loginUserFailure = (error: CustomAuthError): LoginUserFailureAction => ({
    type: LOGIN_USER_FAILURE,
    payload: error,
});