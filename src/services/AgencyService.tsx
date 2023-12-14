import {
    getDatabase,
    ref,
    set,
    get,
    remove,
    push,
    equalTo,
    query,
    orderByChild,
  } from "firebase/database";
  import { firebase } from "../configuration/firebase";
  import { Agency } from "../interfaces/Agency/Agency";
  import { AgencyServiceInterface } from "../interfaces/Agency/AgencyServiceInterface";
import { Country } from "../interfaces/Country/Country";
  
  const database = getDatabase(firebase);
  
  export class AgencyService implements AgencyServiceInterface {
    async addAgency(agency: Agency): Promise<void> {
      try {
        const agencyRef = ref(database, "agencies");
        const newAgencyRef = push(agencyRef);
  
        await set(newAgencyRef, agency);
      } catch (error) {
        console.error("Error adding agency:", error);
        throw error;
      }
    }
  
    async getAllAgencies(): Promise<Agency[]> {
      try {
        const agencyRef = ref(database, "agencies");
        const snapshot = await get(agencyRef);
  
        const agencies: Agency[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const agency: Agency = {
              id: childSnapshot.key as string,
              name: childSnapshot.val().name as string,
              location: {
                id: childSnapshot.val().location.id as string,
                city: childSnapshot.val().location.city as string,
                streetAddress: childSnapshot.val().location.streetAddress as string,
                country: childSnapshot.val().location.country as Country,
                photoName: childSnapshot.val().location.photoName as string,
                photoURL: childSnapshot.val().location.photoURL as string
              }
            };
            agencies.push(agency);
          });
        }
  
        console.log("agencies", agencies);
        return agencies;
      } catch (error) {
        console.error("Error fetching agencies:", error);
        throw error;
      }
    }
  
    async deleteAgency(agencyId: string): Promise<void> {
      try {
        const agencyRef = ref(database, `agencies/${agencyId}`);
        await remove(agencyRef);
      } catch (error) {
        console.error("Error deleting agency:", error);
        throw error;
      }
    }
  
    async updateAgency(updatedAgency: Agency): Promise<void> {
      try {
        const agencyRef = ref(database, `agencies/${updatedAgency.id}`);
        await set(agencyRef, updatedAgency);
      } catch (error) {
        console.error("Error updating agency:", error);
        throw error;
      }
    }
  
    async getAgencyById(agencyId: string): Promise<Agency | null> {
      try {
        const agencyRef = ref(database, `agencies/${agencyId}`);
        const snapshot = await get(agencyRef);
  
        if (snapshot.exists()) {
          const agency: Agency = {
            id: snapshot.key as string,
            name: snapshot.val().name as string,
            location: {
                id: snapshot.val().location.id as string,
                city: snapshot.val().location.city as string,
                streetAddress: snapshot.val().location.streetAddress as string,
                country: snapshot.val().location.country as Country,
                photoName: snapshot.val().location.photoName as string,
                photoURL: snapshot.val().location.photoURL as string
            }
          };
          return agency;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error getting agency by ID:", error);
        throw error;
      }
    }
  
    async getAgenciesByLocationId(locationId: string): Promise<Agency[]> {
      try {
        const agenciesRef = ref(database, "agencies");
        const agenciesQuery = query(
          agenciesRef,
          orderByChild("location/id"),
          equalTo(locationId)
        );
  
        const snapshot = await get(agenciesQuery);
  
        const agencies: Agency[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const agency: Agency = {
              id: childSnapshot.key as string,
              name: childSnapshot.val().name as string,
              location: {
                  id: childSnapshot.val().location.id as string,
                  city: childSnapshot.val().location.city as string,
                  streetAddress: childSnapshot.val().location.streetAddress as string,
                  country: childSnapshot.val().location.country as Country,
                  photoName: childSnapshot.val().location.photoName as string,
                  photoURL: childSnapshot.val().location.photoURL as string
              }
            };
            agencies.push(agency);
          });
        }
  
        console.log("agencies", agencies);
        return agencies;
      } catch (error) {
        console.error("Error fetching agencies by location ID:", error);
        throw error;
      }
    }
  }
  