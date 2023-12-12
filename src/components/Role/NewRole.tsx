import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import { useNavigate, useParams } from 'react-router-dom';
import CreateFormBuilder from '../FormBuilder/CreateFormBuilder';
import CustomAppBar from '../AppBar/CustomAppBar';
import { Paper } from '@mui/material';

const NewRole: React.FC = () => {
  const authService = new AuthService();
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdate = id !== '0';

  useEffect(() => {
    const fetchRoleData = async () => {
      if (isUpdate) {
        try {
          const roleData: Role | null = await authService.getRoleById(id ?? '');
          if (roleData) {
            setName(roleData.name || '');
          }
        } catch (error) {
          console.error('Error fetching role data:', error);
        }
      }
    };

    fetchRoleData();
  }, [id, isUpdate, authService]);

  // useEffect to set the initial value for 'name' after fetching the role data
  useEffect(() => {
    setName(name);
  }, [name]);

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
      <Paper style={{ margin: '15px', padding: '15px' }}>
        {form}
      </Paper>
    </>
  );
};

export default NewRole;
