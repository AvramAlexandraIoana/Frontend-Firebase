import React, { useEffect, useState } from "react";
import { LocationService } from "../../services/LocationService";
import { CountryService } from "../../services/CountryService";
import { Location } from "../../interfaces/Location/Location";
import { Country } from "../../interfaces/Country/Country";
import { useNavigate, useParams } from "react-router-dom";
import CreateFormBuilder from "../FormBuilder/CreateFormBuilder";
import CustomAppBar from "../AppBar/CustomAppBar";
import { Paper, CircularProgress } from "@mui/material";
import { createTypography } from "../ComponentFactory/ComponentFactory";

const NewLocation: React.FC = () => {
  const locationService = new LocationService();
  const countryService = new CountryService();
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== "0";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCountries(true);
        const countriesData: Country[] = await countryService.getAllCountries();
        setCountries(countriesData);

        // If it's an update, fetch location data and set initial country value
        if (isUpdate) {
          const locationData: Location | null =
            await locationService.getLocationById(id ?? "");
          console.log("locationData", locationData);
          if (locationData) {
            setStreetAddress(locationData.streetAddress || "");
            setCity(locationData.city || "");
            // Set the initial value of the country state to the ID of the country
            setCountryId(locationData.country.id || "");
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingLocation(false);
        setLoadingCountries(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Check if both loadingCountries and loadingLocation are false
    if (!loadingCountries && !loadingLocation) {
      setLoading(false);
    }
  }, [loadingCountries, loadingLocation]);

  const handleCancel = () => {
    navigate("/location-list");
  };

  const generateRandomId = (): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 20;
    let randomId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  };

  const handleCreateLocation = async () => {
    console.log(`${isUpdate ? "Updating" : "Creating"} location...`);
    try {
      console.log(countryId);
      const locationId = isUpdate ? id : generateRandomId();
      const selectedCountry = countries.find((c) => c.id === countryId);

      if (!selectedCountry) {
        console.error("Selected country not found.");
        return;
      }

      const locationData = {
        id: locationId,
        streetAddress,
        city,
        country: selectedCountry,
      } as Location;

      if (isUpdate) {
        await locationService.updateLocation(locationData);
      } else {
        await locationService.addLocation(locationData);
      }

      navigate("/location-list");
    } catch (error) {
      console.error(
        `${isUpdate ? "Error updating" : "Error creating"} location:`,
        error
      );
    }
  };

  const formBuilder = new CreateFormBuilder({
    buttonLabel: isUpdate ? "Update Location" : "Create Location",
    cancelButtonLabel: "Cancel",
  });

  const form = formBuilder
    .addTextField({
      label: "Street Address",
      name: "streetAddress",
      value: streetAddress,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setStreetAddress(e.target.value),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addTextField({
      label: "City",
      name: "city",
      value: city,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCity(e.target.value),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addSelectField({
      label: "Country",
      name: "country",
      value: countryId,
      onChange: (e: React.ChangeEvent<{ value: unknown }>) =>
        setCountryId(e.target.value as string),
      options: countries.map((country) => ({
        label: country.name,
        value: country.id,
      })),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .buildForm(handleCreateLocation, handleCancel);

  return (
    <>
      <CustomAppBar />
      <Paper
        style={{
          margin: "15px",
          padding: "15px",
          position: "relative",
        }}
      >
        {createTypography({
          variant: "h5",
          children: isUpdate ? "Update Location" : "Create Location",
        })}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <CircularProgress />
          </div>
        )}
        {!loading && form}
      </Paper>
    </>
  );
};

export default NewLocation;
