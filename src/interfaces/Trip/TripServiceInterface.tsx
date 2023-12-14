import { Purchase } from "./Purchase";
import { Trip } from "./Trip";

export interface TripServiceInterface {
  addTrip(trip: Trip): Promise<void>;
  getAllTrips(): Promise<Trip[]>;
  deleteTrip(tripId: string): Promise<void>;
  updateTrip(updatedTrip: Trip): Promise<void>;
  getTripById(tripId: string): Promise<Trip | null>;
  purchaseTrip(purchase: Purchase): Promise<void>;
}
