import React, { useEffect, useState } from "react";
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
import { Purchase } from "../../interfaces/Trip/Purchase";
import { TripService } from "../../services/TripService";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { AuthService } from "../../services/AuthService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../configuration/firebase";

const PurchaseList: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isViewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const navigate = useNavigate();
  const tripService = new TripService();
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authenticated user:", user);
        fetchPurchases();
      } else {
        console.log("No user signed in.");
        setPurchases([]); // Clear purchases when user signs out
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        const purchasesData: Purchase[] =
          await tripService.getAllPurchasesForUser(user.localId);
        setPurchases(purchasesData);
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, "dd/MM/yyyy") : "";
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Purchase Date",
                  "User ID",
                  "Trip ID",
                  "Trip Name",
                  "Start Date",
                  "End Date",
                  "Price",
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
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{formatDate(new Date(purchase.date))}</TableCell>
                    <TableCell>{purchase.user.localId}</TableCell>
                    <TableCell>{purchase.trip.id}</TableCell>
                    <TableCell>{purchase.trip.name}</TableCell>
                    <TableCell>
                      {purchase.trip.startDate
                        ? formatDate(new Date(purchase.trip.startDate))
                        : ""}
                    </TableCell>
                    <TableCell>
                      {purchase.trip.endDate
                        ? formatDate(new Date(purchase.trip.endDate))
                        : ""}
                    </TableCell>
                    <TableCell>{purchase.trip.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleViewPurchase(purchase)}
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

        {/* View Dialog */}
        <Dialog
          open={isViewDialogOpen}
          onClose={handleViewDialogClose}
          maxWidth="md"
        >
          <DialogTitle style={{ fontWeight: "bold" }}>
            View Purchase
          </DialogTitle>
          <DialogContent>
            {selectedPurchase && (
              <>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {formatDate(new Date(selectedPurchase.date))}
                </p>
                <p>
                  <strong>User ID:</strong> {selectedPurchase.user.localId}
                </p>
                <p>
                  <strong>Trip ID:</strong> {selectedPurchase.trip.id}
                </p>
                <p>
                  <strong>Trip Name:</strong> {selectedPurchase.trip.name}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {selectedPurchase.trip.startDate
                    ? formatDate(new Date(selectedPurchase.trip.startDate))
                    : ""}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {selectedPurchase.trip.endDate
                    ? formatDate(new Date(selectedPurchase.trip.endDate))
                    : ""}
                </p>
                <p>
                  <strong>Price:</strong> {selectedPurchase.trip.price}
                </p>
                {/* Add more fields as needed */}
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

export default PurchaseList;
