import React, { useEffect, useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import { Grid, CircularProgress, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import FormBuilder from "../FormBuilder/FormBuilder";
import {
  createAvatar,
  createTypography,
  createMuiLink,
} from "../ComponentFactory/ComponentFactory";
import adaptToLayout from "../Adapter/Adapter";
import withLayout from "../withLayout/withLayout";
import { loginUser } from "../../redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast, ToastContainer } from "react-toastify";
import { AuthService } from "../../services/AuthService";

const LoginFormFacade = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authService = new AuthService();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  useEffect(() => {
    if (authState.loginError) {
      toast.error(
        authState.loginError.customMessage || "Login failed. Please try again."
      );
      dispatch({ type: "LOGIN_USER_FAILURE", payload: null });
    }
  }, [authState.loginError, dispatch]);

  useEffect(() => {
    if (authState.user) {
      console.log("jere");
      localStorage.setItem("token", authState.user.idToken);

      // Set userRoles in localStorage after successful login
      setUserRolesInLocalStorage();

      navigate("/profile");
    }
  }, [authState.user, navigate]);

  const setUserRolesInLocalStorage = async () => {
    try {
      const userRoles = await authService.getCurrentUserRoles();
      localStorage.setItem("userRoles", JSON.stringify(userRoles));
    } catch (error) {
      console.error("Error setting user roles in localStorage:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    await loginUser(email, password)(dispatch);
    setLoading(false);
  };

  const formBuilder = new FormBuilder({ buttonLabel: "Login" });

  const form = formBuilder
    .addTextField({
      label: "Email Address",
      name: "email",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
      validators: ["required", "isEmail"],
      errorMessages: ["This field is required", "Email is not valid"],
    })
    .addTextField({
      label: "Password",
      name: "password",
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
      type: "password",
      showPassword: showPassword,
      onChangeToggle: () => setShowPassword(!showPassword),
      validators: [
        "required",
        "minStringLength:8",
        "maxStringLength:20",
        "matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$",
      ],
      errorMessages: [
        "This field is required",
        "Password must be at least 8 characters long",
        "Password must be at most 20 characters long",
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
      ],
    })
    .buildForm(handleLogin);

  return adaptToLayout(
    <>
      <ToastContainer />
      {createAvatar({
        sx: { m: "auto", mb: 1, bgcolor: "primary.light" },
        children: <LockOutlined />,
      })}
      {createTypography({ variant: "h5", children: "Login" })}
      {form}
      {loading ? <CircularProgress size={25} /> : null}
      <Grid container justifyContent="flex-end">
        <Grid item>
          {createMuiLink({
            component: RouterLink,
            to: "/register",
            variant: "body2",
            color: "primary",
            underline: "hover",
            children: "Don't have an account? Register",
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default withLayout(LoginFormFacade);
