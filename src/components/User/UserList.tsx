import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { AuthService } from '../../services/Auth/AuthService';
import { User } from '../../interfaces/Auth/User';
import CustomAppBar from '../AppBar/CustomAppBar';
import { useNavigate } from 'react-router-dom';

const authService = new AuthService();

const UserList: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      setIsLoading(true);
      const users: User[] = await authService.getUserList();
      setUserList(users);
    } catch (error) {
      console.error('Error fetching user list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleDeleteUser = async () => {
    try {
     // await authService.deleteUser(selectedUserId);
      await fetchUserList();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  return (
    <>
      <CustomAppBar />
      <Paper style={{ margin: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                userList.map((user) => (
                  <TableRow key={user.localId}>
                    <TableCell>{user.localId}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: '8px' }}
                        onClick={() => {
                          handleEditUser(user.localId);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedUserId(user.localId);
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
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this user?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteUser} variant="contained" color="primary">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default UserList;
