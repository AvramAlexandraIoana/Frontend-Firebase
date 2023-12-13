import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { AuthError } from "firebase/auth";
import { AuthServiceInterface } from "../interfaces/Auth/AuthServiceInterface";
import { CustomAuthError } from "../interfaces/Auth/CustomAuthError";
import { auth, firestore } from "../configuration/firebase";
import { User } from "../interfaces/Auth/User";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Role } from "../interfaces/Auth/Role";
import { UserRecord } from "firebase-admin/auth";
import { auth as adminAuth } from "firebase-admin";

export class AuthService implements AuthServiceInterface {
  async registerUser(
    email: string,
    password: string
  ): Promise<User | CustomAuthError> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return await this.createUserFromUserCredential(userCredential);
    } catch (error) {
      return this.mapAuthErrorToCustomError(error as AuthError, email);
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<User | CustomAuthError> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return await this.createUserFromUserCredential(userCredential);
    } catch (error) {
      return this.mapAuthErrorToCustomError(error as AuthError, email);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async getUserList(): Promise<User[]> {
    try {
      const userList: User[] = [];

      // Use Firebase Admin SDK to retrieve the list of users
      //const listUsersResult = await adminAuth().listUsers();



      console.log("Final User List:", userList);
      return userList;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }

  async getRoleList(): Promise<Role[]> {
    try {
      const roleList: Role[] = [];
      const roleListSnapshot = await getDocs(collection(firestore, "roles"));

      roleListSnapshot.forEach((doc) => {
        const roleData = doc.data() as Role;
        roleData.id = doc.id;
        roleList.push(roleData);
      });

      return roleList;
    } catch (error) {
      console.error("Error fetching role list:", error);
      throw error;
    }
  }

  async addRole(role: Role): Promise<void> {
    try {
      await addDoc(collection(firestore, "roles"), role);
    } catch (error) {
      console.error("Error adding new role:", error);
      throw error;
    }
  }

  async updateRole(roleId: string, updatedRole: Role): Promise<void> {
    try {
      const { name } = updatedRole;
      const roleRef = doc(firestore, "roles", roleId);

      const fieldsToUpdate = {
        name,
      };

      await updateDoc(roleRef, fieldsToUpdate);
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  }

  async getRoleById(roleId: string): Promise<Role | null> {
    try {
      const roleDocRef = doc(firestore, "roles", roleId);
      const roleDocSnapshot = await getDoc(roleDocRef);

      if (roleDocSnapshot.exists()) {
        const roleData = roleDocSnapshot.data() as Role;
        roleData.id = roleDocRef.id;
        return roleData;
      }

      return null; // Return null if the role with the specified ID does not exist
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      const roleRef = doc(firestore, "roles", roleId);
      await deleteDoc(roleRef);
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  }

  mapAuthErrorToCustomError(error: AuthError, email: string): CustomAuthError {
    let customMessage = "";
    console.log(error.code);
    switch (error.code) {
      // ... (your existing switch cases)
      default:
        console.error("Unexpected authentication error:", error);
        customMessage = "An unexpected authentication error occurred.";
        break;
    }

    return { ...error, customMessage };
  }

  async createUserFromUserCredential(
    userCredential: UserCredential
  ): Promise<User> {
    const user: User = {
      kind: "",
      idToken: await userCredential.user.getIdToken(),
      email: userCredential.user?.email || "",
      refreshToken: userCredential.user?.refreshToken || "",
      expiresIn: 3600,
      localId: userCredential.user?.uid || "",
    };
    return user;
  }
}
