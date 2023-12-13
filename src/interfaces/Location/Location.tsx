import { Country } from "../Country/Country";

export interface Location {
    id: string;
    streetAddress: string;
    city: string;
    country: Country; 
    photoName: string; // Add the file name to the Location interface
    photoURL: string; // Add the photo URL to the Location interface
}