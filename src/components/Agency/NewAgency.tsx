import React, { useEffect, useState } from "react";
import { AgencyService } from "../../services/AgencyService";
import { LocationService } from "../../services/LocationService";
import { Agency } from "../../interfaces/Agency/Agency";
import { Location } from "../../interfaces/Location/Location";
import { useNavigate, useParams } from "react-router-dom";
import CreateFormBuilder from "../FormBuilder/CreateFormBuilder";
import CustomAppBar from "../AppBar/CustomAppBar";
import { Paper, CircularProgress } from "@mui/material";
import { createTypography } from "../ComponentFactory/ComponentFactory";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBlob,
} from "firebase/storage";

const NewAgency: React.FC = () => {
  const agencyService = new AgencyService();
  const locationService = new LocationService();
  const [agencyName, setAgencyName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingAgency, setLoadingAgency] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== "0";
  const storage = getStorage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingLocations(true);
        const locationsData: Location[] = await locationService.getAllLocations();
        setLocations(locationsData);

        if (isUpdate) {
          const agencyData: Agency | null = await agencyService.getAgencyById(id ?? "");
          console.log("agencyData", agencyData);
          if (agencyData) {
            setAgencyName(agencyData.name || "");
            setLocationId(agencyData.location.id || "");
          }
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingAgency(false);
        setLoadingLocations(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loadingLocations && !loadingAgency) {
      setLoading(false);
    }
  }, [loadingLocations, loadingAgency]);

  const handleCancel = () => {
    navigate("/agency-list");
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

  const handleCreateAgency = async () => {
    console.log(`${isUpdate ? "Updating" : "Creating"} agency...`);
    try {
      setSaving(true);

      const agencyId = isUpdate ? id : generateRandomId();
      const selectedLocation = locations.find((l) => l.id === locationId);
      if (!selectedLocation) {
        console.error("Selected location not found.");
        return;
      }

      const agencyData = {
        id: agencyId,
        name: agencyName,
        location: selectedLocation,
      } as Agency;
      console.log(agencyData);

      if (isUpdate) {
        await agencyService.updateAgency(agencyData);
      } else {
        await agencyService.addAgency(agencyData);
      }

      navigate("/agency-list");
    } catch (error) {
      console.error(
        `${isUpdate ? "Error updating" : "Error creating"} agency:`,
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const formBuilder = new CreateFormBuilder({
    buttonLabel: isUpdate ? "Update Agency" : "Create Agency",
    cancelButtonLabel: "Cancel",
  });

  const form = formBuilder
    .addTextField({
      label: "Agency Name",
      name: "agencyName",
      value: agencyName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setAgencyName(e.target.value),
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
    .buildForm(handleCreateAgency, handleCancel);

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
          children: isUpdate ? "Update Agency" : "Create Agency",
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

export default NewAgency;
