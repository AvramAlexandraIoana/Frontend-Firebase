// NewCountry.tsx

import React, { useEffect, useState } from "react";
import { CountryService } from "../../services/Country/CountryService";
import { Country } from "../../interfaces/Country/Country";
import { useNavigate, useParams } from "react-router-dom";
import CreateFormBuilder from "../FormBuilder/CreateFormBuilder";
import CustomAppBar from "../AppBar/CustomAppBar";
import { Paper, CircularProgress } from "@mui/material";
import { createTypography } from "../ComponentFactory/ComponentFactory";

const NewCountry: React.FC = () => {
  const countryService = new CountryService();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== "0";

  useEffect(() => {
    const fetchCountryData = async () => {
      if (isUpdate) {
        try {
          setLoading(true);
          const countryData: Country | null =
            await countryService.getCountryById(id ?? "");
          console.log("countryData", countryData);
          if (countryData) {
            setName(countryData.name || "");
          }
        } catch (error) {
          console.error("Error fetching country data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [id, isUpdate, countryService]);

  const handleCancel = () => {
    navigate("/country-list");
  };

  const generateRandomId = (): string => {
    // You can replace this with your own logic to generate a random id
    return Math.random().toString(36).substring(7);
  };

  const handleCreateCountry = async () => {
    console.log(`${isUpdate ? "Updating" : "Creating"} country... ${name}`);
    try {
      const countryId = isUpdate ? id : generateRandomId(); // If updating, use the provided id; otherwise, generate a random id
      if (isUpdate) {
        // await countryService.updateCountry(countryId, { id, name } as Country);
      } else {
        await countryService.addCountry({ id: countryId, name } as Country);
      }
      navigate("/country-list");
    } catch (error) {
      console.error(
        `${isUpdate ? "Error updating" : "Error creating"} country:`,
        error
      );
    }
  };

  const formBuilder = new CreateFormBuilder({
    buttonLabel: isUpdate ? "Update Country" : "Create Country",
    cancelButtonLabel: "Cancel",
  });

  const form = formBuilder
    .addTextField({
      label: "Name",
      name: "name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setName(e.target.value),
      validators: ["required"],
      errorMessages: ["This field is required"],
    })
    .buildForm(handleCreateCountry, handleCancel);

  return (
    <>
      <CustomAppBar />
      <Paper style={{ margin: "15px", padding: "15px", position: "relative" }}>
        {createTypography({
          variant: "h5",
          children: isUpdate ? "Update Country" : "Create Country",
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

export default NewCountry;
