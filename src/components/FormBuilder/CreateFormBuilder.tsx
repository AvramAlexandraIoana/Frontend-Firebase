// FormBuilder.tsx

import React from "react";
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";
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

interface SelectFieldConfig {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  options: { label: string; value: string }[];
  validators?: string[];
  errorMessages?: string[];
}

interface CreateFormBuilderConfig {
  buttonLabel: string;
  cancelButtonLabel: string;
}

class CreateFormBuilder {
  private fields: React.ReactNode[];
  private buttonLabel: string;
  private cancelButtonLabel: string;

  constructor(config: CreateFormBuilderConfig) {
    this.fields = [];
    this.buttonLabel = config.buttonLabel;
    this.cancelButtonLabel = config.cancelButtonLabel;
  }

  addTextField(config: FieldConfig): CreateFormBuilder {
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

  addSelectField(config: SelectFieldConfig): CreateFormBuilder {
    const { label, name, value, onChange, options, validators = [], errorMessages = [] } = config;

    const selectField = (
      <SelectValidator
        key={name}
        fullWidth
        variant="outlined"
        margin="normal"
        label={label}
        onChange={onChange}
        name={name}
        value={value}
        validators={validators}
        errorMessages={errorMessages}
        autoComplete="off"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectValidator>
    );

    this.fields.push(selectField);
    return this; // for method chaining
  }

  buildForm(
    handleSubmit: () => void,
    handleCancel: () => void
  ): React.ReactNode {
    return (
      <ValidatorForm onSubmit={handleSubmit} instantValidate={true}>
        {this.fields}
        {createButton({
          type: "submit",
          fullWidth: false,
          variant: "contained",
          children: this.buttonLabel,
        })}
        {createButton({
          fullWidth: false,
          variant: "outlined",
          children: this.cancelButtonLabel,
          style: { marginLeft: "15px" },
          onClick: handleCancel,
        })}
      </ValidatorForm>
    );
  }
}

export default CreateFormBuilder;
