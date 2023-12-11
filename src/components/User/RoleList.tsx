import React, { useEffect, useState } from 'react';
import MaterialTable, { Action } from 'material-table';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import CustomAppBar from '../AppBar/CustomAppBar';
import { Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

// Import Material-UI icons
import AddBoxIcon from '@material-ui/icons/AddBox';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FilterListIcon from '@material-ui/icons/FilterList';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import RemoveIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: AddBoxIcon,
  Check: CheckIcon,
  Clear: ClearIcon,
  Delete: DeleteOutlineIcon,
  DetailPanel: ChevronRightIcon,
  Edit: EditIcon,
  Export: SaveAltIcon,
  Filter: FilterListIcon,
  FirstPage: FirstPageIcon,
  LastPage: LastPageIcon,
  NextPage: ChevronRightIcon,
  PreviousPage: ChevronLeftIcon,
  ResetSearch: ClearIcon,
  Search: SearchIcon,
  SortArrow: ChevronRightIcon,
  ThirdStateCheck: RemoveIcon,
  ViewColumn: ViewColumnIcon,
};

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

  const addRoleAction: Action<Role> = {
    icon: () => <AddBoxIcon />,
    tooltip: 'Add New Role',
    isFreeAction: true,
    onClick: () => setAddRoleDialogOpen(true),
  };

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
            <MaterialTable
                title="Role List"
                columns={columns}
                data={roleList}
                icons={tableIcons as any}
                isLoading={isLoading}
                actions={[addRoleAction]}
                options={{
                    pageSize: 10,
                    pageSizeOptions: [10],
                    search: true,
                    sorting: false,
                    rowStyle: {
                    margin: '0',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    fontSize: '1.25rem',
                    lineHeight: 1.6,
                    letterSpacing: '0.0075em',
                    },
                    headerStyle: {
                    margin: '0',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    lineHeight: 1.6,
                    letterSpacing: '0.0075em',
                    },
                }}
            />

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
