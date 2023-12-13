// AuthServiceInterface.tsx
import { AuthError, UserCredential } from "firebase/auth";
import { User } from "./User";
import { CustomAuthError } from "./CustomAuthError";
import { Role } from "./Role";

export interface AuthServiceInterface {
  registerUser(email: string, password: string): Promise<User | AuthError>;
  loginUser(email: string, password: string): Promise<User | AuthError>;
  mapAuthErrorToCustomError(error: AuthError, email: string): CustomAuthError;
  createUserFromUserCredential(userCredential: UserCredential): Promise<User>;
  getRoleList(): Promise<Role[]>;
  addRole(role: Role): Promise<void>;
  updateRole(roleId: string, updatedRole: Role): Promise<void>;
  getRoleById(roleId: string): Promise<Role | null>;
  deleteRole(roleId: string): Promise<void>;
  updateUserRoles(userId: string, roles: Role[]): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getCurrentUserRoles(): Promise<string[]>;
}
