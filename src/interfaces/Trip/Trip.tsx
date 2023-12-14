import { Agency } from "../Agency/Agency";
import { Location } from "../Location/Location";

export interface Trip {
  id: string;
  name: string;
  price: number;
  numberOfSeats: number;
  duration: string;
  startDate: Date | null;
  endDate: Date  | null;
  location: Location;
  agency: Agency;
}
