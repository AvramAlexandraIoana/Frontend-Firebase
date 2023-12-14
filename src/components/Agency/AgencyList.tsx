import React, { useEffect, useState } from "react";
import { Agency } from "../../interfaces/Agency/Agency";
import { AgencyService } from "../../services/AgencyService";
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

const agencyService = new AgencyService();

const AgencyList: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const agenciesData: Agency[] = await agencyService.getAllAgencies();
      setAgencies(agenciesData);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgency = async () => {
    try {
      await agencyService.deleteAgency(selectedAgency?.id || "");
      await fetchAgencies();
    } catch (error) {
      console.error("Error deleting agency:", error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleViewAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleEditAgency = (agencyId: string) => {
    navigate(`/agency/${agencyId}`);
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
          onClick={() => navigate("/agency/0")}
          style={{ margin: "15px" }}
        >
          Add New Agency
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Agency Id", "Name", "Location", "Actions"].map(
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
                    colSpan={4}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.id}</TableCell>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.location.city}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: "8px" }}
                        onClick={() => {
                          handleEditAgency(agency.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedAgency(agency);
                          setDeleteConfirmationOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleViewAgency(agency)}
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
          <DialogTitle>Delete Agency</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this agency?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAgency}
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
          <DialogTitle style={{ fontWeight: "bold" }}>View Agency</DialogTitle>
          <DialogContent>
            {selectedAgency && (
              <>
                <p>
                  <strong>Agency ID:</strong> {selectedAgency.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedAgency.name}
                </p>
                <p>
                  <strong>Location:</strong> {selectedAgency.location.city}
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

export default AgencyList;
