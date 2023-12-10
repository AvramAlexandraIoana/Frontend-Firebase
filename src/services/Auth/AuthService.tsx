import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthError } from 'firebase/auth';
import { AuthServiceInterface } from '../../interfaces/Auth/AuthServiceInterface';
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import { auth } from '../../configuration/firebase';
import { User } from '../../interfaces/Auth/User';

export class AuthService implements AuthServiceInterface {
  async registerUser(email: string, password: string): Promise<User | CustomAuthError> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return await this.createUserFromUserCredential(userCredential);
    } catch (error) {
      return this.mapAuthErrorToCustomError(error as AuthError, email);
    }
  }

  async loginUser(email: string, password: string): Promise<User | CustomAuthError> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return await this.createUserFromUserCredential(userCredential);
    } catch (error) {
      return this.mapAuthErrorToCustomError(error as AuthError, email);
    }
  }

  mapAuthErrorToCustomError(error: AuthError, email: string): CustomAuthError {
    let customMessage = '';
    console.log(error.code);
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
      case 'auth/invalid-credential':
        customMessage = 'Invalid credential.';
        break
      default:
        console.error('Unexpected authentication error:', error);
        customMessage = 'An unexpected authentication error occurred.';
        break;
    }

    return { ...error, customMessage };
  }

  async createUserFromUserCredential(userCredential: UserCredential): Promise<User> {
    // Replace 'identitytoolkit#SignupNewUserResponse' with your actual kind value
    const user: User = {
      kind: 'identitytoolkit#SignupNewUserResponse',
      idToken:  await userCredential.user.getIdToken(),
      email: userCredential.user?.email || '',
      refreshToken: userCredential.user?.refreshToken || '',
      expiresIn: 3600, // Adjust based on your actual data structure
      localId: userCredential.user?.uid || '',
    };
    return user;
  }
  
}
