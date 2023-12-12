import { User } from "./User";

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}
