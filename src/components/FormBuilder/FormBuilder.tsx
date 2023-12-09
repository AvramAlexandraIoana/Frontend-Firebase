// FormBuilder.tsx
import React from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface FieldConfig {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  validators?: string[];
  errorMessages?: string[];
  showPassword?: boolean; // New prop for displaying password
  onChangeToggle?: () => void; // New prop for handling password toggle
}

class FormBuilder {
  private fields: React.ReactNode[];

  constructor() {
    this.fields = [];
  }

  addTextField(config: FieldConfig): FormBuilder {
    const {
      label,
      name,
      value,
      onChange,
      type = 'text',
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
        type={showPassword ? 'text' : type} // Show password in plain text if showPassword is true
        validators={validators}
        errorMessages={errorMessages}
        autoComplete="off" // Add this line to disable autocomplete
        InputProps={{
          endAdornment:
            type === 'password' ? (
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
      </ValidatorForm>
    );
  }
}

export default FormBuilder;
