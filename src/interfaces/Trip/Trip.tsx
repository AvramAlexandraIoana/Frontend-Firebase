import { Agency } from "../Agency/Agency";
import { Location } from "../Location/Location";

export interface Trip {
  id: string;
  name: string;
  price: number;
  numberOfSeats: number;
  duration: string;
  startDate: string;
  endDate: string;
  location: Location;
  agency: Agency;
}
