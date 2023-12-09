
import { User } from "../interfaces/Auth/User";

// Constants for action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Interface for the action when login is successful
interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User; // Payload is of type User when login is successful
}

// Interface for the action when login fails
interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: { error: string }; // Payload includes an error message when login fails
}

// Interface for the action when logout occurs
interface LogoutAction {
  type: typeof LOGOUT;
}

// Combined type for all authentication actions
export type AuthAction = LoginSuccessAction | LoginFailureAction | LogoutAction;
