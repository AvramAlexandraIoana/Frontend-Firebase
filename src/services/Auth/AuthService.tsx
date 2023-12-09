// AuthService.ts
import {
    AuthError,
    UserCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from 'firebase/auth';
  import { AuthServiceInterface } from '../../interfaces/Auth/AuthServiceInterface';
  import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
  import { auth } from '../../configuration/firebase';
  
  export class AuthService implements AuthServiceInterface {
    private static mapAuthErrorToCustomError(error: AuthError, email: string): CustomAuthError {
      let customMessage = '';
  
      switch (error.code) {
        case 'auth/email-already-in-use':
          customMessage = `Email ${email} is already in use. Please use a different email.`;
          break;
        case 'auth/invalid-email':
          customMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          customMessage = 'The password is too weak.';
          break;
        case 'auth/user-not-found':
          customMessage = 'User not found.';
          break;
        case 'auth/wrong-password':
          customMessage = 'Wrong password.';
          break;
        // Add more cases as needed
        default:
          customMessage = 'An unexpected authentication error occurred.';
          break;
      }
  
      return { ...error, customMessage };
    }
  
    async registerUser(email: string, password: string): Promise<UserCredential | CustomAuthError> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        return AuthService.mapAuthErrorToCustomError(error as AuthError, email);
      }
    }
  
    async loginUser(email: string, password: string): Promise<UserCredential | CustomAuthError> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        return AuthService.mapAuthErrorToCustomError(error as AuthError, email);
      }
    }
  }
  