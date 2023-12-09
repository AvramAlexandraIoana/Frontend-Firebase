import { AuthError } from 'firebase/auth';

export interface CustomAuthError extends AuthError {
    customMessage: string; // Add any additional properties you need
}