import React, { useEffect, useState } from 'react';
// import MaterialTable from 'material-table';
import { AuthService } from '../../services/Auth/AuthService';
import { Role } from '../../interfaces/Auth/Role';
import CustomAppBar from '../AppBar/CustomAppBar';

const RoleList = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const authService = new AuthService();

  useEffect(() => {
    // Fetch the role list when the component mounts
    fetchRoleList();
  }, []);

  const fetchRoleList = async () => {
    try {
      const roles = await authService.getRoleList();
      console.log('roles', roles);
      setRoleList(roles);
    } catch (error) {
      console.error('Error fetching role list:', error);
    }
  };

  const columns = [
    { title: 'Role ID', field: 'roleId' },
    { title: 'Role Name', field: 'roleName' },
    // Add more columns based on your Role object properties
  ];

  return (
    <CustomAppBar />
    // <MaterialTable
    //   title="Role List"
    //   columns={columns}
    //   data={roleList}
    //   options={{
    //     pageSize: 10,
    //     pageSizeOptions: [5, 10, 20],
    //     search: false,
    //   }}
    // />
  );
};

export default RoleList;
