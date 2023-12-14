import React, { useEffect, useState } from "react";
import { TripService } from "../../services/TripService";
import { LocationService } from "../../services/LocationService";
import { AgencyService } from "../../services/AgencyService";
import { Trip } from "../../interfaces/Trip/Trip";
import { Location } from "../../interfaces/Location/Location";
import { Agency } from "../../interfaces/Agency/Agency";
import { useNavigate, useParams } from "react-router-dom";
import CreateFormBuilder from "../FormBuilder/CreateFormBuilder";
import CustomAppBar from "../AppBar/CustomAppBar";
import { Paper, CircularProgress } from "@mui/material";
import { createTypography } from "../ComponentFactory/ComponentFactory";
import DatePicker from '@mui/lab/DatePicker';
import { ToastContainer, toast } from "react-toastify";

const NewTrip: React.FC = () => {
  const tripService = new TripService();
  const locationService = new LocationService();
  const agencyService = new AgencyService();

  const [tripName, setTripName] = useState("");
  const [price, setPrice] = useState<number | null>();
  const [numberOfSeats, setNumberOfSeats] = useState<number | null>();
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null); // Updated to use Date
  const [endDate, setEndDate] = useState<Date | null>(null); // Updated to use Date
  const [locationId, setLocationId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== "0";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingLocations(true);
        const locationsData: Location[] = await locationService.getAllLocations();
        console.log(locationsData);
        setLocations(locationsData);

        setLoadingAgencies(true);
        const agenciesData: Agency[] = await agencyService.getAllAgencies();
        console.log(agenciesData);
        setAgencies(agenciesData);

        if (isUpdate) {
          const tripData: Trip | null = await tripService.getTripById(id ?? "");
          console.log("tripData", tripData);
          if (tripData) {
            setTripName(tripData.name || "");
            setPrice(tripData.price);
            setNumberOfSeats(tripData.numberOfSeats);
            setDuration(tripData.duration || "");
            setStartDate(tripData.startDate ? new Date(tripData.startDate) : null); // Updated to use Date
            setEndDate(tripData.endDate ? new Date(tripData.endDate) : null); // Updated to use Date
            setLocationId(tripData.location.id || "");
            setAgencyId(tripData.agency.id || "");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingTrip(false);
        setLoadingLocations(false);
        setLoadingAgencies(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loadingLocations && !loadingAgencies && !loadingTrip) {
      setLoading(false);
    }
  }, [loadingLocations, loadingAgencies, loadingTrip]);

  const handleCancel = () => {
    navigate("/trip-list");
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

  const handleCreateTrip = async () => {
    console.log(`${isUpdate ? "Updating" : "Creating"} trip...`);
    try {
      setSaving(true);

      const tripId = isUpdate ? id : generateRandomId();
      const selectedLocation = locations.find((l) => l.id === locationId);
      const selectedAgency = agencies.find((a) => a.id === agencyId);

      if (!selectedLocation || !selectedAgency) {
        console.error("Selected location or agency not found.");
        return;
      }

      if (startDate && endDate && startDate > endDate) {
        console.error("Start date must be before end date.");
        toast.error("Start date must be before end date.");
        return;
      }

      const tripData = {
        id: tripId,
        name: tripName,
        price: price,
        numberOfSeats: numberOfSeats,
        duration: duration,
        startDate: startDate ? startDate.toISOString() : null, // Updated to use Date
        endDate: endDate ? endDate.toISOString() : null, // Updated to use Date
        location: selectedLocation,
        agency: selectedAgency,
      } as Trip;
      console.log(tripData);

      if (isUpdate) {
        await tripService.updateTrip(tripData);
      } else {
        await tripService.addTrip(tripData);
      }

      navigate("/trip-list");
    } catch (error) {
      console.error(
        `${isUpdate ? "Error updating" : "Error creating"} trip:`,
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const formBuilder = new CreateFormBuilder({
    buttonLabel: isUpdate ? "Update Trip" : "Create Trip",
    cancelButtonLabel: "Cancel",
  });

  const form = formBuilder
    .addTextField({
      label: "Trip Name",
      name: "tripName",
      value: tripName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setTripName(e.target.value),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addNumberField({
      label: "Price",
      name: "price",
      value: price ? price.toString() : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPrice(parseFloat(e.target.value)),
      validators: ["required", "minNumber:0"],
      errorMessages: ["This field is required", "Price must be at least 0"],
    })
    .addNumberField({
      label: "Number of Seats",
      name: "numberOfSeats",
      value: numberOfSeats ? numberOfSeats.toString() : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNumberOfSeats(parseInt(e.target.value)),
      validators: ["required", "minNumber:1"],
      errorMessages: ["This field is required", "Must be at least 1 seat"],
    })
    .addTextField({
      label: "Duration",
      name: "duration",
      value: duration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDuration(e.target.value),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addDatePickerField({  // Updated to use DatePicker
      label: "Start Date",
      name: "startDate",
      value: startDate,
      onChange: (date: Date | null) => setStartDate(date),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addDatePickerField({  // Updated to use DatePicker
      label: "End Date",
      name: "endDate",
      value: endDate,
      onChange: (date: Date | null) => setEndDate(date),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addSelectField({
      label: "Location",
      name: "location",
      value: locationId,
      onChange: (e: React.ChangeEvent<{ value: unknown }>) =>
        setLocationId(e.target.value as string),
      options: locations.map((location) => ({
        label: location.city,
        value: location.id,
      })),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .addSelectField({
      label: "Agency",
      name: "agency",
      value: agencyId,
      onChange: (e: React.ChangeEvent<{ value: unknown }>) =>
        setAgencyId(e.target.value as string),
      options: agencies.map((agency) => ({
        label: agency.name,
        value: agency.id,
      })),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .buildForm(handleCreateTrip, handleCancel);

  return (
    <>
      <ToastContainer />
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
          children: isUpdate ? "Update Trip" : "Create Trip",
        })}
        {(loading || saving) && (
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

export default NewTrip;
