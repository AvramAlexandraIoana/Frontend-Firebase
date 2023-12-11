import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import RegisterFormFacade from './components/Auth/RegisterFormFacade';
import LoginFormFacade from './components/Auth/LoginFormFacade';
import Profile from './components/Auth/Profile';
import './assets/css/global.css'; // Import the global CSS file
import UserList from './components/User/UserList';
import RoleList from './components/User/RoleList';

function App() {
  return (
    <Provider store={store}>
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<RegisterFormFacade />} />
          <Route path="/login" element={<LoginFormFacade />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/role-list" element={<RoleList />} />
        </Routes>
      </>
    </Provider>
  );
}

export default App;
