// LocationList.tsx

import React, { useEffect, useState } from "react";
import { Location } from "../../interfaces/Location/Location";
import { LocationService } from "../../services/LocationService";
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
import CustomAppBar from "../AppBar/CustomAppBar";
import { useNavigate } from "react-router-dom";

const locationService = new LocationService();

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddLocationDialogOpen, setAddLocationDialogOpen] =
    useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<Location>({
    id: "",
    streetAddress: "",
    city: "",
    country: { id: "", name: "" },
  });
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const locationsData: Location[] = await locationService.getAllLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = async () => {
    try {
      await locationService.deleteLocation(selectedLocationId);
      await fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleAddNewLocation = () => {
    navigate("/location/0");
  };

  const handleEditLocation = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  const handleCloseAddLocationDialog = () => {
    setAddLocationDialogOpen(false);
  };

  const handleSaveNewLocation = async () => {
    try {
      await locationService.addLocation(newLocation);
      await fetchLocations();
    } catch (error) {
      console.error("Error adding new location:", error);
    } finally {
      setAddLocationDialogOpen(false);
    }
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
          onClick={handleAddNewLocation}
          style={{ margin: "15px" }}
        >
          Add New Location
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location Id</TableCell>
                <TableCell>Street Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.id}</TableCell>
                    <TableCell>{location.streetAddress}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.country.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: "8px" }}
                        onClick={() => {
                          handleEditLocation(location.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedLocationId(location.id);
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
          <DialogTitle>Delete Location</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this location?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteLocation}
              variant="contained"
              color="primary"
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Location Dialog */}
        <Dialog
          open={isAddLocationDialogOpen}
          onClose={handleCloseAddLocationDialog}
          maxWidth="xs"
        >
          <DialogTitle>Add New Location</DialogTitle>
          <DialogContent>
            {/* Include form fields for new location data */}
            {/* For example, input fields for streetAddress, city, and country */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddLocationDialog}>Cancel</Button>
            <Button
              onClick={handleSaveNewLocation}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default LocationList;
