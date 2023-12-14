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
        // User is signed in, you can access user data
        const uid = user.uid;
        const email = user.email;
        // Add other user properties as needed
        console.log("Authenticated user:", user);
        fetchPurchases();
      } else {
        // User is signed out
        console.log("No user signed in.");
        setPurchases([]); // Clear purchases when user signs out
        setIsLoading(false);
      }
    });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        const purchasesData: Purchase[] =
          await tripService.getAllPurchasesForUser(user.localId);
        setPurchases(purchasesData);
      } else {
        // Handle the case where the user is not logged in
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
                  // Add more fields as needed
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
                    {/* Add more fields as needed */}
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
