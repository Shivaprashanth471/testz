import { IconButton, TableRow, TextField } from "@material-ui/core";
// import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";

interface ExperienceReadOnlyRowProps {
  experience: any;
  openAdd: any;
  index?: number
}

const ReadOnlyRow = ({ experience, openAdd }: ExperienceReadOnlyRowProps) => {
  return (
    <TableRow>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.facility_name}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.location}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.position_title}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.specialisation}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={moment(experience.start_date).format('MM-YYYY')}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.end_date ? moment(experience.end_date).format('MM-YYYY') : "Present"}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={experience.skills ? experience.skills : "NA"}
          disabled
        />
      </td>

      <td>
        <IconButton onClick={() => openAdd(experience?._id)}>
          <DeleteIcon className="delete-icon" />
        </IconButton>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
