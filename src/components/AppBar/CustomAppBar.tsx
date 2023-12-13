import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthService } from "../../services/AuthService"; // Import your AuthService

const CustomAppBar: React.FC = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const authService = new AuthService();

  useEffect(() => {
    // Fetch user roles when the component mounts
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const userRoles = await authService.getCurrentUserRoles();
      setUserRoles(userRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Travel App</Typography>

        <div style={{ marginLeft: "auto" }}>
          {/* Conditionally render navigation buttons based on roles */}
          {userRoles.includes("admin") && (
            <Button component={Link} to="/user-list" color="inherit">
              User List
            </Button>
          )}
          {userRoles.includes("admin") && (
            <Button component={Link} to="/role-list" color="inherit">
              Role List
            </Button>
          )}
          {userRoles.includes("admin") && (
            <Button component={Link} to="/location-list" color="inherit">
              Location List
            </Button>
         )}
         {userRoles.includes("admin") && (
            <Button component={Link} to="/country-list" color="inherit">
              Country List
            </Button>
          )}
          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
