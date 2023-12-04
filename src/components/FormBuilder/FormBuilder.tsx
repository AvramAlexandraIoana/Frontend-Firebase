import React, { ReactNode } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

class FormBuilder {
  private formFields: ReactNode[] = [];

  addTextField(label: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string, value: string, validators: string[], errorMessages: string[]) {
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
        validators={validators}
        errorMessages={errorMessages}
      />
    );
    this.formFields.push(textField);
    return this; // for method chaining
  }

  buildForm(onSubmit: () => void) {
    return (
      <ValidatorForm onSubmit={onSubmit} instantValidate={true}>
        {this.formFields}
      </ValidatorForm>
    );
  }
}

export default FormBuilder;
