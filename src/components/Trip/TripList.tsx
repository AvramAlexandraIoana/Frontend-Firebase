import React, { useEffect, useState } from "react";
import { Trip } from "../../interfaces/Trip/Trip";
import { TripService } from "../../services/TripService";
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
import DatePicker from "@mui/lab/DatePicker";
import { format } from "date-fns";
import { Purchase } from "../../interfaces/Trip/Purchase";
import { AuthService } from "../../services/AuthService";

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const navigate = useNavigate();
  const tripService = new TripService();
  const authService = new AuthService();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const tripsData: Trip[] = await tripService.getAllTrips();
      setTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await tripService.deleteTrip(selectedTrip?.id || "");
      await fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleEditTrip = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, "dd/MM/yyyy") : "";
  };

  const hasUserRole = (role: string) => {
    const userRoles = localStorage.getItem("userRoles");
    return userRoles && userRoles.includes(role);
  };

  const handlePurchaseTrip = async (trip: Trip) => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        // Handle the case where the user is not logged in
        console.error("User not logged in");
        return;
      }

      const purchase: Purchase = {
        id: generateRandomId(),
        test: "test",
        date: new Date(), // This line sets the purchaseDate to the current date and time
        user,
        trip,
      };

      await tripService.purchaseTrip(purchase);
      // Optionally, you can fetch and update the trips after a purchase
      await fetchTrips();
    } catch (error) {
      console.error("Error purchasing trip:", error);
    }
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
        {(hasUserRole("admin") || hasUserRole("agentie")) && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/trip/0")}
            style={{ margin: "15px" }}
          >
            Add New Trip
          </Button>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Trip Id",
                  "Name",
                  "Price",
                  "Number of Seats",
                  "Duration",
                  "Start Date",
                  "End Date",
                  "Location",
                  "Agency",
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
                    colSpan={10}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.id}</TableCell>
                    <TableCell>{trip.name}</TableCell>
                    <TableCell>{trip.price}</TableCell>
                    <TableCell>{trip.numberOfSeats}</TableCell>
                    <TableCell>{trip.duration}</TableCell>
                    <TableCell>
                      {trip.startDate
                        ? formatDate(new Date(trip.startDate))
                        : ""}
                    </TableCell>
                    <TableCell>
                      {trip.endDate ? formatDate(new Date(trip.endDate)) : ""}
                    </TableCell>
                    <TableCell>{trip.location.city}</TableCell>
                    <TableCell>{trip.agency.name}</TableCell>
                    <TableCell>
                      {(hasUserRole("admin") || hasUserRole("agentie")) && (
                        <Button
                          variant="outlined"
                          style={{ marginRight: "8px" }}
                          onClick={() => {
                            handleEditTrip(trip.id);
                          }}
                        >
                          Edit
                        </Button>
                      )}

                      {(hasUserRole("admin") || hasUserRole("agentie")) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedTrip(trip);
                            setDeleteConfirmationOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleViewTrip(trip)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handlePurchaseTrip(trip)}
                      >
                        Purchase
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
          <DialogTitle>Delete Trip</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this trip?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTrip}
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
          <DialogTitle style={{ fontWeight: "bold" }}>View Trip</DialogTitle>
          <DialogContent>
            {selectedTrip && (
              <>
                <p>
                  <strong>Trip ID:</strong> {selectedTrip.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedTrip.name}
                </p>
                <p>
                  <strong>Price:</strong> {selectedTrip.price}
                </p>
                <p>
                  <strong>Number of Seats:</strong> {selectedTrip.numberOfSeats}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedTrip.duration}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {selectedTrip.startDate
                    ? formatDate(new Date(selectedTrip.startDate))
                    : ""}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {selectedTrip.endDate
                    ? formatDate(new Date(selectedTrip.endDate))
                    : ""}
                </p>
                <p>
                  <strong>Location:</strong> {selectedTrip.location.city}
                </p>
                <p>
                  <strong>Agency:</strong> {selectedTrip.agency.name}
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

export default TripList;
