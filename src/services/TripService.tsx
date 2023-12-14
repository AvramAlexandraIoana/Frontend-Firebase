import { Location } from "../interfaces/Location/Location";
import { Agency } from "../interfaces/Agency/Agency";
import { Trip } from "../interfaces/Trip/Trip";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { firebase } from "../configuration/firebase";
import { Country } from "../interfaces/Country/Country";
import { Purchase } from "../interfaces/Trip/Purchase";
import { TripServiceInterface } from "../interfaces/Trip/TripServiceInterface";
import { User } from "../interfaces/Auth/User";

const database = getDatabase(firebase);

export class TripService implements TripServiceInterface {
  async addTrip(trip: Trip): Promise<void> {
    try {
      const tripRef = ref(database, "trips");
      const newTripRef = push(tripRef);

      await set(newTripRef, trip);
    } catch (error) {
      console.error("Error adding trip:", error);
      throw error;
    }
  }

  async getAllTrips(): Promise<Trip[]> {
    try {
      const tripsRef = ref(database, "trips");
      const snapshot = await get(tripsRef);

      const trips: Trip[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const trip: Trip = {
            id: childSnapshot.key as string,
            name: childSnapshot.val().name as string,
            price: childSnapshot.val().price as number,
            numberOfSeats: childSnapshot.val().numberOfSeats as number,
            duration: childSnapshot.val().duration as string,
            startDate: childSnapshot.val().startDate as Date,
            endDate: childSnapshot.val().endDate as Date,
            location: {
              id: childSnapshot.val().location.id as string,
              city: childSnapshot.val().location.city as string,
              streetAddress: childSnapshot.val().location
                .streetAddress as string,
              country: childSnapshot.val().location.country as Country,
              photoName: childSnapshot.val().location.photoName as string,
              photoURL: childSnapshot.val().location.photoURL as string,
            },
            agency: {
              id: childSnapshot.val().agency.id as string,
              name: childSnapshot.val().agency.name as string,
              location: {
                id: childSnapshot.val().agency.location.id as string,
                city: childSnapshot.val().agency.location.city as string,
                streetAddress: childSnapshot.val().agency.location
                  .streetAddress as string,
                country: childSnapshot.val().agency.location.country as Country,
                photoName: childSnapshot.val().agency.location
                  .photoName as string,
                photoURL: childSnapshot.val().agency.location
                  .photoURL as string,
              },
            },
          };
          trips.push(trip);
        });
      }

      console.log("trips", trips);
      return trips;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      const tripRef = ref(database, `trips/${tripId}`);
      await remove(tripRef);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  }

  async updateTrip(updatedTrip: Trip): Promise<void> {
    try {
      const tripRef = ref(database, `trips/${updatedTrip.id}`);
      await set(tripRef, updatedTrip);
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const tripRef = ref(database, `trips/${tripId}`);
      const snapshot = await get(tripRef);

      if (snapshot.exists()) {
        const trip: Trip = {
          id: snapshot.key as string,
          name: snapshot.val().name as string,
          price: snapshot.val().price as number,
          numberOfSeats: snapshot.val().numberOfSeats as number,
          duration: snapshot.val().duration as string,
          startDate: snapshot.val().startDate as Date,
          endDate: snapshot.val().endDate as Date,
          location: {
            id: snapshot.val().location.id as string,
            city: snapshot.val().location.city as string,
            streetAddress: snapshot.val().location.streetAddress as string,
            country: snapshot.val().location.country as Country,
            photoName: snapshot.val().location.photoName as string,
            photoURL: snapshot.val().location.photoURL as string,
          },
          agency: {
            id: snapshot.val().agency.id as string,
            name: snapshot.val().agency.name as string,
            location: {
              id: snapshot.val().agency.location.id as string,
              city: snapshot.val().agency.location.city as string,
              streetAddress: snapshot.val().agency.location
                .streetAddress as string,
              country: snapshot.val().agency.location.country as Country,
              photoName: snapshot.val().agency.location.photoName as string,
              photoURL: snapshot.val().agency.location.photoURL as string,
            },
          },
        };
        return trip;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting trip by ID:", error);
      throw error;
    }
  }

  async purchaseTrip(purchase: Purchase): Promise<void> {
    try {
      const purchasesRef = ref(database, "purchases");
      const newPurchaseRef = push(purchasesRef);

      await set(newPurchaseRef, purchase);
    } catch (error) {
      console.error("Error purchasing trip:", error);
      throw error;
    }
  }

  async getAllPurchasesForUser(userId: string): Promise<Purchase[]> {
    try {
      const purchasesRef = ref(database, "purchases");
      const userPurchasesQuery = query(
        purchasesRef,
        orderByChild("user/localId"),
        equalTo(userId)
      );

      const snapshot = await get(userPurchasesQuery);

      const purchases: Purchase[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const purchase: Purchase = {
            id: childSnapshot.key as string,
            test: childSnapshot.val().test as string,
            date: childSnapshot.val().date as Date,
            user: childSnapshot.val().user as User, // Adjust this based on your structure
            trip: childSnapshot.val().trip as Trip,
          };
          purchases.push(purchase);
        });
      }

      console.log("purchases for user", purchases);
      return purchases;
    } catch (error) {
      console.error("Error fetching user purchases:", error);
      throw error;
    }
  }
}
