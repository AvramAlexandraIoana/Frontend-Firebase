import { Country } from "./Country";

export interface CountryServiceInterface {
  getAllCountries(): Promise<Country[]>;
  addCountry(country: Country): Promise<void>;
  deleteCountry(countryName: string): Promise<void>;
}
