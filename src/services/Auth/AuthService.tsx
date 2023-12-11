import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { AuthError } from 'firebase/auth';
import { AuthServiceInterface } from '../../interfaces/Auth/AuthServiceInterface';
import { CustomAuthError } from '../../interfaces/Auth/CustomAuthError';
import { auth, firestore } from '../../configuration/firebase';
import { User } from '../../interfaces/Auth/User';
import { collection, getDocs } from 'firebase/firestore';

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

  async getUserList(): Promise<User[]> {
    try {
      const userList: User[] = [];
      const userListSnapshot = await getDocs(collection(firestore, 'users'));
      console.log('User List Snapshot:', userListSnapshot.docs.length);
  
      userListSnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('User Data:', userData);
  
        if (userData && userData.uid && userData.email) {
          const user: User = {
            kind: 'identitytoolkit#SignupNewUserResponse', // Adjust as needed
            idToken: '',
            email: userData.email || '',
            refreshToken: '',
            expiresIn: 0,
            localId: userData.uid || '',
          };
  
          userList.push(user);
        }
      });
  
      console.log('Final User List:', userList);
      return userList;
    } catch (error) {
      console.error('Error fetching user list:', error);
      throw error;
    }
  }  
  
  mapAuthErrorToCustomError(error: AuthError, email: string): CustomAuthError {
    let customMessage = '';
    console.log(error.code);
    switch (error.code) {
      // ... (your existing switch cases)
      default:
        console.error('Unexpected authentication error:', error);
        customMessage = 'An unexpected authentication error occurred.';
        break;
    }

    return { ...error, customMessage };
  }

  async createUserFromUserCredential(userCredential: UserCredential): Promise<User> {
    const user: User = {
      kind: '',
      idToken: await userCredential.user.getIdToken(),
      email: userCredential.user?.email || '',
      refreshToken: userCredential.user?.refreshToken || '',
      expiresIn: 3600,
      localId: userCredential.user?.uid || '',
    };
    return user;
  }
}
