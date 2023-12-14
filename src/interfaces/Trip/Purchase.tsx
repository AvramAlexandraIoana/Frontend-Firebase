import { User } from "../Auth/User";
import { Trip } from "./Trip";

export interface Purchase {
  id: string;
  user: User;
  trip: Trip;
  purchaseDate: Date;
}
