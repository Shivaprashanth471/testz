import { IconButton, TableRow, TextField, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";

interface EducationReadOnlyProps {
  education: any;
  openAdd: any;
  index: number;
}

const ReadOnlyRow = ({ education, openAdd }: EducationReadOnlyProps) => {
  return (
     <TableRow className={"mat-tr"}>
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
          value={moment(education.start_date).format("MM-YYYY")}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={moment(education.graduation_date).format("MM-YYYY")}
          disabled
        />
      </td>

      <td>
        {/* <IconButton onClick={(event) => handleEditClick(event, education)}>
					<CreateIcon className='edit-icon' />
				</IconButton> */}
        <Tooltip title={`Delete Education`}>
          <IconButton onClick={() => openAdd(education?._id)}>
            <DeleteIcon className="delete-icon" />
          </IconButton>
        </Tooltip>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
