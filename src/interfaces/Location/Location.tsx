import { Country } from "../Country/Country";

export interface Location {
    id: string;
    streetAddress: string;
    city: string;
    country: Country; 
}