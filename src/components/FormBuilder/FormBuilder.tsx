// FormBuilder.tsx
import React from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createButton } from "../ComponentFactory/ComponentFactory";

interface FieldConfig {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "email" | "password";
  validators?: string[];
  errorMessages?: string[];
  showPassword?: boolean;
  onChangeToggle?: () => void;
}

interface FormBuilderConfig {
  buttonLabel: string;
}

class FormBuilder {
  private fields: React.ReactNode[];
  private buttonLabel: string;

  constructor(config: FormBuilderConfig) {
    this.fields = [];
    this.buttonLabel = config.buttonLabel;
  }

  addTextField(config: FieldConfig): FormBuilder {
    const {
      label,
      name,
      value,
      onChange,
      type = "text",
      validators = [],
      errorMessages = [],
      showPassword = false,
      onChangeToggle,
    } = config;

    const textField = (
      <TextValidator
        key={name}
        fullWidth
        variant="outlined"
        margin="normal"
        label={label}
        onChange={onChange}
        name={name}
        value={value}
        type={showPassword ? "text" : type}
        validators={validators}
        errorMessages={errorMessages}
        autoComplete="off"
        InputProps={{
          endAdornment:
            type === "password" ? (
              <InputAdornment position="end">
                <IconButton onClick={onChangeToggle} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
      />
    );

    this.fields.push(textField);
    return this; // for method chaining
  }

  buildForm(handleSubmit: () => void): React.ReactNode {
    return (
      <ValidatorForm onSubmit={handleSubmit} instantValidate={true}>
        {this.fields}
        {createButton({
          type: "submit",
          fullWidth: true,
          variant: "contained",
          sx: { mt: 3, mb: 2, borderRadius: 20 },
          children: this.buttonLabel,
        })}
      </ValidatorForm>
    );
  }
}

export default FormBuilder;
