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
  Typography,
} from "@mui/material";
import CustomAppBar from "../AppBar/CustomAppBar";
import { useNavigate } from "react-router-dom";

const locationService = new LocationService();

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
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
      await locationService.deleteLocation(selectedLocation?.id || "");
      await fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleViewLocation = (location: Location) => {
    setSelectedLocation(location);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleEditLocation = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  // Check if the user has a specific role
  const hasUserRole = (role: string) => {
    const userRoles = localStorage.getItem("userRoles");
    return userRoles && userRoles.includes(role);
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
        {hasUserRole("admin") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/location/0")}
            style={{ margin: "15px" }}
          >
            Add New Location
          </Button>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Location Id",
                  "Street Address",
                  "City",
                  "Country",
                  "Actions",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    {header}
                  </TableCell>
                ))}
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
                      {hasUserRole("admin") && (
                        <Button
                          variant="outlined"
                          style={{ marginRight: "8px" }}
                          onClick={() => {
                            handleEditLocation(location.id);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      {hasUserRole("admin") && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedLocation(location);
                            setDeleteConfirmationOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleViewLocation(location)}
                      >
                        View
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

        {/* View Dialog */}
        <Dialog
          open={isViewDialogOpen}
          onClose={handleViewDialogClose}
          maxWidth="md"
        >
          <DialogTitle style={{ fontWeight: "bold" }}>
            View Location
          </DialogTitle>
          <DialogContent>
            {selectedLocation && (
              <>
                <p>
                  <strong>Location ID:</strong> {selectedLocation.id}
                </p>
                <p>
                  <strong>Street Address:</strong>{" "}
                  {selectedLocation.streetAddress}
                </p>
                <p>
                  <strong>City:</strong> {selectedLocation.city}
                </p>
                <p>
                  <strong>Country:</strong> {selectedLocation.country.name}
                </p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default LocationList;
