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
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Role } from "../interfaces/Auth/Role";
import { ListUsersResult, getAuth, UserRecord } from "firebase-admin/auth";
import { auth as adminAuth } from "firebase-admin"; // Import the admin auth instance


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

      const user = await this.createUserFromUserCredential(userCredential);

      // Save user information in the "users" collection
      await this.saveUserInCollection(user);

      return user;
    } catch (error) {
      return this.mapAuthErrorToCustomError(error as AuthError, email);
    }
  }

  async saveUserInCollection(user: User): Promise<void> {
    try {
      const usersCollection = collection(firestore, "users");
      const userDocRef = doc(usersCollection, user.localId);
  
      // Include roles in the user document
      var role = await this.getRoleByName("client");
      const userDataWithRoles = { ...user, roles: role ? [role] : [] }; // Initialize with an empty array of roles
      await setDoc(userDocRef, userDataWithRoles);
    } catch (error) {
      console.error("Error saving user in collection:", error);
      throw error;
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
      const usersCollection = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const userList: User[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as User;
      //  userData.id = doc.id;
        userList.push(userData);
      });

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

  async getRoleByName(roleName: string): Promise<Role | null> {
    try {
      const rolesCollection = collection(firestore, "roles");
  
      // Use a query to find the role with the specified name
      const querySnapshot = await getDocs(
        query(rolesCollection, where("name", "==", roleName))
      );
  
      if (!querySnapshot.empty) {
        const roleDoc = querySnapshot.docs[0];
        const roleData = roleDoc.data() as Role;
        roleData.id = roleDoc.id;
        return roleData;
      }
  
      return null; // Return null if the role with the specified name does not exist
    } catch (error) {
      console.error("Error fetching role by name:", error);
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

  async updateUserRoles(userId: string, roles: Role[]): Promise<void> {
    try {
      const userDocRef = doc(firestore, "users", userId);

      // Update the roles field in the user document
      await updateDoc(userDocRef, {
        roles: roles.map((role) => ({ id: role.id, name: role.name })),
      });
    } catch (error) {
      console.error("Error updating user roles:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user document from Firestore
      const userDocRef = doc(collection(firestore, 'users'), userId);
      await deleteDoc(userDocRef);

      // Delete user from Firebase Authentication
      //await getAuth().deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
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
      roles: [],
    };
    return user;
  }
}
