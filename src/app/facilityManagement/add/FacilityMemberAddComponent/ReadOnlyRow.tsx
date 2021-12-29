import { IconButton, TableRow, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

interface readOnlyRowProps {
  member: any;
  handleDeleteClick: any;
}

const ReadOnlyRow = ({ member, handleDeleteClick }: readOnlyRowProps) => {
  return (
    <TableRow>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={member.name}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={member.phone_number}
          disabled
        />
      </td>

      <td >
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={member.extension_number ? member.extension_number : "NA"}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={member.email ? member.email : "NA"}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={member.designation}
          disabled
        />
      </td>

      <td>
        <IconButton onClick={() => handleDeleteClick(member?.tempId)}>
          <DeleteIcon className="delete-icon" />
        </IconButton>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
