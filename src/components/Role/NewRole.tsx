import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import { useNavigate, useParams } from 'react-router-dom';
import CreateFormBuilder from '../FormBuilder/CreateFormBuilder';
import CustomAppBar from '../AppBar/CustomAppBar';
import { Paper, CircularProgress } from '@mui/material';
import { createTypography } from '../ComponentFactory/ComponentFactory';

const NewRole: React.FC = () => {
  const authService = new AuthService();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== '0';

  useEffect(() => {
    const fetchRoleData = async () => {
      if (isUpdate) {
        try {
          setLoading(true); // Set loading to true before starting the fetch
          const roleData: Role | null = await authService.getRoleById(id ?? '');
          console.log('roleData', roleData);
          if (roleData) {
            setName(roleData.name || '');
          }
        } catch (error) {
          console.error('Error fetching role data:', error);
        } finally {
          setLoading(false); // Set loading to false when fetch completes (whether it's successful or encounters an error)
        }
      } else {
        setLoading(false); // Set loading to false when fetch completes (whether it's successful or encounters an error)
      }
    };

    fetchRoleData();
  }, [id]);

  const handleCancel = () => {
    navigate('/role-list');
  };

  const handleCreateRole = async () => {
    console.log(`${isUpdate ? 'Updating' : 'Creating'} role... ${name}`);
    try {
      if (isUpdate) {
        await authService.updateRole(id ?? '', { name: name } as Role);
      } else {
        await authService.addRole({ name: name } as Role);
      }
      navigate('/role-list');
    } catch (error) {
      console.error(`${isUpdate ? 'Error updating' : 'Error creating'} role:`, error);
    }
  };

  const formBuilder = new CreateFormBuilder({
    buttonLabel: isUpdate ? 'Update Role' : 'Create Role',
    cancelButtonLabel: 'Cancel',
  });

  const form = formBuilder
    .addTextField({
      label: 'Name',
      name: 'name',
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
      validators: ['required'],
      errorMessages: ['This field is required'],
    })
    .buildForm(handleCreateRole, handleCancel);

  return (
    <>
      <CustomAppBar />
      <Paper style={{ margin: '15px', padding: '15px', position: 'relative' }}>
        {createTypography({ variant: 'h5', children: isUpdate ? 'Update Role' : 'Create Role'})}
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <CircularProgress /> {/* Loading indicator */}
          </div>
        )}
        {!loading && form}
      </Paper>
    </>
  );
};

export default NewRole;
