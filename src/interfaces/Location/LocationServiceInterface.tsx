import { Location } from "../Location/Location";

export interface LocationServiceInterface {
    addLocation(location: Location): Promise<void>;
    getAllLocations(): Promise<Location[]>;
    deleteLocation(locationId: string): Promise<void>;
    updateLocation(updatedLocation: Location): Promise<void>;
}
  