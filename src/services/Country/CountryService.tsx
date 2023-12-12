// CountryService.ts

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  remove,
  push,
} from "firebase/database";
import { firebase } from "../../configuration/firebase";
import { Country } from "../../interfaces/Country/Country";
import { CountryServiceInterface } from "../../interfaces/Country/CountryServiceInterface";

// Get the database instance from Firebase
const database = getDatabase(firebase);

export class CountryService implements CountryServiceInterface {
  async addCountry(country: Country): Promise<void> {
    try {
      const countryRef = ref(database, "countries");
      // Push a new entry with an auto-generated key
      const newCountryRef = push(countryRef);

      // Set the data for the new entry
      await set(newCountryRef, {
        name: country.name,
        // Add other properties of the country object as needed
      });
    } catch (error) {
      console.error("Error adding country:", error);
      throw error;
    }
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      const countryRef = ref(database, "countries");
      const snapshot = await get(countryRef);

      const countries: Country[] = [];
      if (snapshot.exists()) {
        // Loop through the snapshot to get country names
        snapshot.forEach((childSnapshot) => {
          const country: Country = {
            id: childSnapshot.key as string,
            // Map properties from childSnapshot.val()
            name: childSnapshot.val().name as string,
            // Add other properties based on your data structure
            // otherProperty: childSnapshot.val().otherProperty as string,
          };
          countries.push(country);
        });
      }

      console.log("countries", countries);
      return countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  }

  async deleteCountry(countryId: string): Promise<void> {
    try {
      const countryRef = ref(database, `countries/${countryId}`);
      // Remove the specific country entry with the given countryId
      await remove(countryRef);
    } catch (error) {
      console.error("Error deleting country:", error);
      throw error;
    }
  }

  async updateCountry(updatedCountry: Country): Promise<void> {
    try {
      const countryRef = ref(database, `countries/${updatedCountry.id}`);
      // Use the set method to update the country
      await set(countryRef, {
        name: updatedCountry.name,
        // Add other properties of the country object as needed
      });
    } catch (error) {
      console.error("Error updating country:", error);
      throw error;
    }
  }

  async getCountryById(countryId: string): Promise<Country | null> {
    try {
      const countryRef = ref(database, `countries/${countryId}`);
      const snapshot = await get(countryRef);

      if (snapshot.exists()) {
        // Create a Country object from the snapshot
        const country: Country = {
          id: snapshot.key as string,
          name: snapshot.val().name as string,
          // Add other properties based on your data structure
          // otherProperty: snapshot.val().otherProperty as string,
        };
        return country;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting country by ID:", error);
      throw error;
    }
  }
}
