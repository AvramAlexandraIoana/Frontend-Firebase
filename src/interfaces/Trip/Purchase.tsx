import { User } from "../Auth/User";
import { Trip } from "./Trip";

export interface Purchase {
  user: User;
  trip: Trip;
  purchaseDate: Date; // Add purchaseDate field to track when the purchase was made
}
