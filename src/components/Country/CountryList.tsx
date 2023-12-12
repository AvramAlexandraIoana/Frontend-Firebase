// CountryList.tsx

import React, { useEffect, useState } from "react";
import { Country } from "../../interfaces/Country/Country";
import { CountryService } from "../../services/Country/CountryService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "../AppBar/CustomAppBar";

const countryService = new CountryService();

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddCountryDialogOpen, setAddCountryDialogOpen] =
    useState<boolean>(false);
  const [newCountryName, setNewCountryName] = useState<string>("");
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const countriesData: Country[] = await countryService.getAllCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCountry = async () => {
    try {
      await countryService.deleteCountry(selectedCountryId);
      await fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleAddNewCountry = () => {
    navigate("/country/0");
  };

  const handleEditCountry = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  return (
    <>
      <CustomAppBar />
      <Paper
        style={{
          margin: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewCountry}
          style={{ margin: "15px" }}
        >
          Add New Country
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Country Id</TableCell>
                <TableCell>Country Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                countries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell>{country.id}</TableCell>
                    <TableCell>{country.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: "8px" }}
                        onClick={() => {
                          handleEditCountry(country.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedCountryId(country.id);
                          setSelectedCountryName(country.name);
                          setDeleteConfirmationOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          maxWidth="xs"
        >
          <DialogTitle>Delete Country</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this country?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCountry}
              variant="contained"
              color="primary"
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default CountryList;
