import { IconButton, TableRow, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";

interface EducationReadOnlyProps {
  education: any;
  openAdd: any;
  index: number
}

const ReadOnlyRow = ({ education, openAdd }: EducationReadOnlyProps) => {
  return (
    <TableRow>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.institute_name}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.degree}
          disabled
        />
      </td>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={education.location}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={moment(education.start_date).format('MM-YYYY')}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={moment(education.graduation_date).format('MM-YYYY')}
          disabled
        />
      </td>

      <td>
        {/* <IconButton onClick={(event) => handleEditClick(event, education)}>
					<CreateIcon className='edit-icon' />
				</IconButton> */}

        <IconButton onClick={() => openAdd(education?._id)}>
          <DeleteIcon className="delete-icon" />
        </IconButton>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
