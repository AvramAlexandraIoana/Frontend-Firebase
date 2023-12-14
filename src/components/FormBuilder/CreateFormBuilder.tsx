import React from "react";
import {
  TextValidator,
  ValidatorForm,
  SelectValidator
} from "react-material-ui-form-validator";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createButton } from "../ComponentFactory/ComponentFactory";
import { Input, InputLabel, MenuItem, TextField } from "@mui/material";
import { FileUploadOutlined, Event } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerTextValidator = (params: any) => (
  <TextValidator
    {...params}
    fullWidth
    variant="outlined"
    margin="normal"
    validators={params.validators}
    errorMessages={params.errorMessages}
    autoComplete="off"
  />
);

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

interface FileConfig {
  label: string;
  name: string;
  value?: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DatePickerFieldConfig {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
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
  
  addNumberField(config: FieldConfig): CreateFormBuilder {
    return this.addTextField({
      ...config,
      type: "number",
    });
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
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </SelectValidator>
    );
  
    this.fields.push(selectField);
    return this; // for method chaining
  }

  addFileInput(config: FileConfig, displayFileName?: boolean, displayPreview?: boolean): CreateFormBuilder {
    const { label, name, onChange } = config;
  
    const fileInput = (
      <div>
        {displayFileName && (
          <span style={{ marginBottom: "10px" }}>
            {config.value ? config.value.name : "No file selected"}
          </span>
        )}
        <IconButton component="label">
          <FileUploadOutlined />
          <input
            style={{ display: "none" }}
            type="file"
            hidden
            onChange={onChange}
            name={name}
          />
        </IconButton>
        {displayPreview && config.value && (
          <div style={{ marginTop: "10px", width: "100%", maxWidth: "300px" }}>
            <InputLabel>Image Preview:</InputLabel>
            <img
              src={URL.createObjectURL(config.value)}
              alt="Location Photo Preview"
              style={{ width: "100%", height: "auto", maxHeight: "300px", marginTop: "5px" }}
            />
          </div>
        )}
      </div>
    );
  
    this.fields.push(fileInput);
    return this; // for method chaining
  }
  addDatePickerField(config: DatePickerFieldConfig): CreateFormBuilder {
    const { label, name, value, onChange, validators = [], errorMessages = [] } = config;

    const datePickerField = (
      <>
       <span>{label}</span>
        <div key={name}>
          <DatePicker
            selected={value}
            dateFormat="dd/MM/yyyy"
            onChange={(date: Date) => onChange(date)}
            customInput={<DatePickerTextValidator />}
          />
        </div>
      </>
     
    );

    this.fields.push(datePickerField);
    return this; // for method chaining
  }

  addImageField(label: string, name: string, value: string): CreateFormBuilder {
    const imageField = (
      <div key={name}>
        <InputLabel>{name}</InputLabel>
      </div>
    );

    this.fields.push(imageField);
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
