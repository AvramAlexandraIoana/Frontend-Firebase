// AuthServiceInterface.tsx
import { AuthError, UserCredential } from 'firebase/auth';

export interface AuthServiceInterface {
  registerUser(email: string, password: string): Promise<UserCredential | AuthError>;
  loginUser(email: string, password: string): Promise<UserCredential | AuthError>;
}
