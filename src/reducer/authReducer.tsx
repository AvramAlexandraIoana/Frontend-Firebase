// authReducer.ts
import { AuthState } from '../interfaces/Auth/AuthState';
import { AuthAction, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types/authTypes';

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          kind: action.payload.kind,
          idToken: action.payload.idToken,
          email: action.payload.email,
          refreshToken: action.payload.refreshToken,
          expiresIn: action.payload.expiresIn, // Assuming expiresIn is a string, you can adjust the type accordingly
          localId: action.payload.localId
        },
        isLoggedIn: true,
      };
    case LOGIN_FAILURE:
    case LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default authReducer;
