import React from "react";
import { Role } from "../../interfaces/Auth/Role";
import { Checkbox, FormControlLabel } from "@mui/material";

interface MultiSelectProps {
  allRoles: Role[];
  selectedRoles: Role[];
  onChange: (selectedRoles: Role[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  allRoles,
  selectedRoles,
  onChange,
}) => {
  const handleRoleToggle = (role: Role) => {
    const updatedRoles = selectedRoles.some((r) => r.id === role.id)
      ? selectedRoles.filter((r) => r.id !== role.id)
      : [...selectedRoles, role];
    onChange(updatedRoles);
  };

  return (
    <div>
      {allRoles.map((role) => (
        <FormControlLabel
          key={role.id}
          control={
            <Checkbox
              checked={selectedRoles.some((r) => r.id === role.id)}
              onChange={() => handleRoleToggle(role)}
            />
          }
          label={role.name}
        />
      ))}
    </div>
  );
};

export default MultiSelect;
