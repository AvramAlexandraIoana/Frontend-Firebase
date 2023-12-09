// AuthServiceInterface.tsx
import { AuthError, UserCredential } from 'firebase/auth';
import { User } from './User';

export interface AuthServiceInterface {
  registerUser(email: string, password: string): Promise<UserCredential | AuthError>;
  loginUser(email: string, password: string): Promise<User | AuthError>;
}
