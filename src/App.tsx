import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import RegisterFormFacade from "./components/Auth/RegisterFormFacade";
import LoginFormFacade from "./components/Auth/LoginFormFacade";
import Profile from "./components/Auth/Profile";
import "./assets/css/global.css"; // Import the global CSS file
import UserList from "./components/User/UserList";
import RoleList from "./components/Role/RoleList";
import NewRole from "./components/Role/NewRole";
import CountryList from "./components/Country/CountryList";
import NewCountry from "./components/Country/NewCountry";
import LocationList from "./components/Location/LocationList";
import NewLocation from "./components/Location/NewLocation";

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
          <Route path="/role/:id" element={<NewRole />} />

          <Route path="/country-list" element={<CountryList />} />
          <Route path="/country/:id" element={<NewCountry />} />

          <Route path="/location-list" element={<LocationList />} />
          <Route path="/location/:id" element={<NewLocation />} />
        </Routes>
      </>
    </Provider>
  );
}

export default App;
