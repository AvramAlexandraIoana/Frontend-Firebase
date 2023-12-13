// LocationService.ts

import {
    getDatabase,
    ref,
    set,
    get,
    remove,
    push,
    equalTo,
    child,
    query,
    orderByChild,
  } from "firebase/database";
import { firebase } from "../configuration/firebase";
import { Location } from "../interfaces/Location/Location";
import { LocationServiceInterface } from "../interfaces/Location/LocationServiceInterface";
  
  const database = getDatabase(firebase);
  
  export class LocationService implements LocationServiceInterface {
    async addLocation(location: Location): Promise<void> {
      try {
        const locationRef = ref(database, "locations");
        const newLocationRef = push(locationRef);
  
        await set(newLocationRef, location);
      } catch (error) {
        console.error("Error adding location:", error);
        throw error;
      }
    }
  
    async getAllLocations(): Promise<Location[]> {
      try {
        const locationRef = ref(database, "locations");
        const snapshot = await get(locationRef);
  
        const locations: Location[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const location: Location = {
              id: childSnapshot.key as string,
              streetAddress: childSnapshot.val().streetAddress as string,
              city: childSnapshot.val().city as string,
              photoURL: childSnapshot.val().photoUrl as string,
              country: {
                id: childSnapshot.val().country.id as string,
                name: childSnapshot.val().country.name as string,
              },
              // Add other properties based on your data structure
              // otherProperty: childSnapshot.val().otherProperty as string,
            };
            locations.push(location);
          });
        }
  
        console.log("locations", locations);
        return locations;
      } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
      }
    }
  
    async deleteLocation(locationId: string): Promise<void> {
      try {
        const locationRef = ref(database, `locations/${locationId}`);
        await remove(locationRef);
      } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
      }
    }
  
    async updateLocation(updatedLocation: Location): Promise<void> {
      try {
        const locationRef = ref(database, `locations/${updatedLocation.id}`);
        await set(locationRef, updatedLocation);
      } catch (error) {
        console.error("Error updating location:", error);
        throw error;
      }
    }
  
    async getLocationById(locationId: string): Promise<Location | null> {
      try {
        const locationRef = ref(database, `locations/${locationId}`);
        const snapshot = await get(locationRef);
  
        if (snapshot.exists()) {
          const location: Location = {
            id: snapshot.key as string,
            streetAddress: snapshot.val().streetAddress as string,
            city: snapshot.val().city as string,
            photoURL: "",
            country: {
              id: snapshot.val().country.id as string,
              name: snapshot.val().country.name as string,
            }
            // Add other properties based on your data structure
            // otherProperty: snapshot.val().otherProperty as string,
          };
          return location;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error getting location by ID:", error);
        throw error;
      }
    }
    
    async getLocationsByCountryId(countryId: string): Promise<Location[]> {
        try {
            const locationsRef = ref(database, "locations");
            const locationsQuery = query(
              locationsRef,
              orderByChild("country/id"),
              equalTo(countryId)
            );
    
          const snapshot = await get(locationsQuery);
    
          const locations: Location[] = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const location: Location = {
                id: childSnapshot.key as string,
                streetAddress: childSnapshot.val().streetAddress as string,
                city: childSnapshot.val().city as string,
                photoURL: "",
                country: {
                  id: childSnapshot.val().country.id as string,
                  name: childSnapshot.val().country.name as string,
                }
                // Add other properties based on your data structure
                // otherProperty: childSnapshot.val().otherProperty as string,
              };
              locations.push(location);
            });
          }
    
          console.log("locations", locations);
          return locations;
        } catch (error) {
          console.error("Error fetching locations by country ID:", error);
          throw error;
        }
      }

  }
  