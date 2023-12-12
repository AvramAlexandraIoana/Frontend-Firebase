// authActions.ts
import { Dispatch } from "redux";
import { User } from "../../interfaces/Auth/User";
import { CustomAuthError } from "../../interfaces/Auth/CustomAuthError";
import {
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
} from "./authActionTypes";
import { AuthService } from "../../services/Auth/AuthService";

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
export const registerUser =
  (email: string, password: string) =>
  async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      const result = await authService.registerUser(email, password);
      console.log(typeof result);
      if ("kind" in result) {
        // This means result is a User
        dispatch(registerUserSuccess(result));
      } else {
        // This means result is a CustomAuthError
        dispatch(registerUserFailure(result));
      }
    } catch (error) {
      // Handle other errors, e.g., network errors
      console.error("Unexpected error:", error);
    }
  };

// Async action creator for login
export const loginUser =
  (email: string, password: string) =>
  async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      const result = await authService.loginUser(email, password);
      if ("kind" in result) {
        // This means result is a User
        dispatch(loginUserSuccess(result));
      } else {
        // This means result is a CustomAuthError
        dispatch(loginUserFailure(result));
      }
    } catch (error) {
      // Handle other errors, e.g., network errors
      console.error("Unexpected error:", error);
    }
  };

// Sync action creators for register success and failure
export const registerUserSuccess = (user: User): RegisterUserSuccessAction => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});

export const registerUserFailure = (
  error: CustomAuthError
): RegisterUserFailureAction => ({
  type: REGISTER_USER_FAILURE,
  payload: error,
});

// Sync action creators for login success and failure
export const loginUserSuccess = (user: User): LoginUserSuccessAction => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});

export const loginUserFailure = (
  error: CustomAuthError
): LoginUserFailureAction => ({
  type: LOGIN_USER_FAILURE,
  payload: error,
});
