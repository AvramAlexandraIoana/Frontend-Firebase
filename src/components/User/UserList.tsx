// UserList.tsx

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
import { AuthService } from "../../services/AuthService";
import { User } from "../../interfaces/Auth/User";
import { Role } from "../../interfaces/Auth/Role";
import CustomAppBar from "../AppBar/CustomAppBar";
import { useNavigate } from "react-router-dom";
import MultiSelect from "../ComponentFactory/MultiSelect";

const authService = new AuthService();

const UserList: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<Role[]>([]);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch both user and role lists concurrently using Promise.all
      const [users, roles] = await Promise.all([
        authService.getUserList(),
        authService.getRoleList(),
      ]);

      setUserList(users);
      setRoleList(roles);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDialogOpen = (user: User) => {
    setSelectedUser(user);
    setSelectedUserRoles(user.roles || []);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleSaveRoles = async (updatedRoles: Role[]) => {
    try {
      if (selectedUser) {
        await authService.updateUserRoles(selectedUser.localId, updatedRoles);
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating user roles:", error);
    } finally {
      handleEditDialogClose();
    }
  };

  const handleDeleteUser = async () => {
    try {
      await authService.deleteUser(selectedUser?.localId || "");
      await fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleteConfirmationOpen(false);
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
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
                userList.map((user) => (
                  <TableRow key={user.localId}>
                    <TableCell>{user.localId}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles &&
                        user.roles.map((rol: Role) => {
                          const role = roleList.find((r) => r.id === rol.id);
                          return role ? role.name : "";
                        }).join(", ")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: "8px" }}
                        onClick={() => {
                          handleEditDialogOpen(user);
                        }}
                      >
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Roles Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleEditDialogClose}
          maxWidth="xs"
        >
          <DialogTitle>Edit User Roles</DialogTitle>
          <DialogContent>
            <MultiSelect
              allRoles={roleList}
              selectedRoles={selectedUserRoles}
              onChange={setSelectedUserRoles}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button
              onClick={() => handleSaveRoles(selectedUserRoles)}
              variant="contained"
              color="primary"
            >
              Save Roles
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          maxWidth="xs"
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this user?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
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

export default UserList;
