// RoleList.tsx
import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import CustomAppBar from '../AppBar/CustomAppBar';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

const authService = new AuthService();

const RoleList: React.FC = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddRoleDialogOpen, setAddRoleDialogOpen] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    fetchRoleList();
  }, []);

  const fetchRoleList = async () => {
    try {
      setIsLoading(true);
      const roles: Role[] = await authService.getRoleList();
      setRoleList(roles);
    } catch (error) {
      console.error('Error fetching role list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    try {
      await authService.addRole({ name: newRoleName } as Role);
      await fetchRoleList();
    } catch (error) {
      console.error('Error adding new role:', error);
    } finally {
      setAddRoleDialogOpen(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await authService.deleteRole(selectedRoleId);
      await fetchRoleList();
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  return (
    <>
      <CustomAppBar />
      <Paper style={{ margin: '15px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                roleList.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: '8px' }}
                        onClick={() => {
                          // Add logic to handle edit
                          console.log(`Edit role: ${role.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedRoleId(role.id);
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
          <DialogTitle>Delete Role</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this role?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteRole} variant="contained" color="primary">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default RoleList;
