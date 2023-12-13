import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";

const CustomAppBar: React.FC = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const authService = new AuthService();

  useEffect(() => {
    // Fetch user roles when the component mounts
    fetchUserRoles();
  }, []); // Empty dependency array to run the effect only once

  const fetchUserRoles = async () => {
    try {
      // Retrieve user roles from localStorage
      const storedUserRoles = localStorage.getItem("userRoles");
      if (storedUserRoles) {
        setUserRoles(JSON.parse(storedUserRoles));
      } else {
        // If roles are not in localStorage, fetch them from the AuthService
        const userRoles = await authService.getCurrentUserRoles();
        setUserRoles(userRoles);

        // Update roles in localStorage for future use
        localStorage.setItem("userRoles", JSON.stringify(userRoles));
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Travel App</Typography>

        <div style={{ marginLeft: "auto" }}>
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
          {userRoles.includes("admin") ||
            (userRoles.includes("agentie") && (
              <Button component={Link} to="/location-list" color="inherit">
                Location List
              </Button>
            ))}
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
