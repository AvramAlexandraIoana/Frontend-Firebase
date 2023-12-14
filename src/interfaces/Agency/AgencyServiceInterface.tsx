import { Location } from "../Location/Location";
import { Agency } from "./Agency";

export interface AgencyServiceInterface {
    addAgency(agency: Agency): Promise<void>;
    getAllAgencies(): Promise<Agency[]>;
    deleteAgency(agencyId: string): Promise<void>;
    updateAgency(updatedAgency: Agency): Promise<void> ;
    getAgenciesByLocationId(locationId: string): Promise<Agency[]>;
}
  