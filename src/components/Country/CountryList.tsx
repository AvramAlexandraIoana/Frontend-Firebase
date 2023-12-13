import React, { useEffect, useState } from "react";
import { Country } from "../../interfaces/Country/Country";
import { CountryService } from "../../services/CountryService";
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
import { Location } from "../../interfaces/Location/Location";
import { LocationService } from "../../services/LocationService";

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const countryService = new CountryService();
  const locationService = new LocationService();
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
      const locations =
        await locationService.getLocationsByCountryId(selectedCountryId);
      await Promise.all(
        locations.map((location: Location) =>
          locationService.deleteLocation(location.id)
        )
      );

      await countryService.deleteCountry(selectedCountryId);

      await fetchCountries();
    } catch (error) {
      console.error("Error deleting country and related locations:", error);
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
                {["Country Id", "Country Name", "Actions"].map(
                  (header, index) => (
                    <TableCell
                      key={index}
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
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
