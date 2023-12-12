import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import CustomAppBar from '../AppBar/CustomAppBar';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';


const RoleList: React.FC = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddRoleDialogOpen, setAddRoleDialogOpen] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const authService = new AuthService();

  useEffect(() => {
    fetchRoleList();
  }, []);

  const fetchRoleList = async () => {
    try {
      setIsLoading(true);
      const roles = await authService.getRoleList();
      console.log('Role List:', roles);
      setRoleList(roles);
    } catch (error) {
      console.error('Error fetching role list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { title: 'Role Name', field: 'name' },
    // Add more columns based on your Role object properties
  ];


  const handleAddRole = async () => {
    try {
      // Add logic to add a new role
      // For example: await authService.addRole({ name: newRoleName });
      // Then fetch the updated role list
      await fetchRoleList();
    } catch (error) {
      console.error('Error adding new role:', error);
    } finally {
      setAddRoleDialogOpen(false);
    }
  };

  return (
    <>
        <CustomAppBar />
        <div style={{ margin: '20px' }}>


          {/* Add Role Dialog */}
            <Dialog
                open={isAddRoleDialogOpen}
                onClose={() => setAddRoleDialogOpen(false)}
                maxWidth="xs" // Adjust the maximum width of the dialog
                fullWidth // Use full width
                >
                <DialogTitle>Add New Role</DialogTitle>
                <DialogContent>
                    <TextField
                    label="Role Name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    fullWidth // Use full width for the text field
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddRoleDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRole} variant="contained" color="primary">
                    Add Role
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    </>
  );
};

export default RoleList;
