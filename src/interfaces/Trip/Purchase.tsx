import { User } from "../Auth/User";
import { Trip } from "./Trip";

export interface Purchase {
  id: string;
  date: Date;
  user: User;
  trip: Trip;
}
