import { IconButton, TableRow, TextField, Tooltip } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import React from "react";

interface readOnlyRowProps {
  member: any;
  openAdd: any;
}

const ReadOnlyRow = ({ member, openAdd }: readOnlyRowProps) => {
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

      <td>
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
        <Tooltip title={`Delete ${member.name} Facility Member`}>
          <IconButton onClick={() => openAdd(member?._id)}>
            <Delete className="delete-icon" />
          </IconButton>
        </Tooltip>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
