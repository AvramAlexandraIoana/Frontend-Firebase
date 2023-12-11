import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/Auth/AuthService';
import { User } from '../../interfaces/Auth/User';

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const authService = new AuthService();

  useEffect(() => {
    // Fetch the user list when the component mounts
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const users = await authService.getUserList();
      setUserList(users);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const handleEditClick = (rowData: User) => {
    // Implement the edit action, for example, navigate to the edit page
    console.log('Edit clicked for user:', rowData);
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Edit</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((user) => (
          <tr key={user.localId}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.localId}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              <button onClick={() => handleEditClick(user)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
