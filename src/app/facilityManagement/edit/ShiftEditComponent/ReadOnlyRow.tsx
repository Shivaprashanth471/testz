import { IconButton, TableRow, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";
import { CommonService } from "../../../../helpers";

interface readOnlyRowProps {
  timezone: any;
  shiftTimings: any;
  handleDeleteClick: any;
}

const ReadOnlyRow = ({ timezone, shiftTimings, handleDeleteClick }: readOnlyRowProps) => {
  const start_time_to_show = moment(CommonService.convertMinsToHrsMins(shiftTimings.shift_start_time), 'hh:mm').format('LT')
  const end_time_to_show = moment(CommonService.convertMinsToHrsMins(shiftTimings.shift_end_time), 'hh:mm').format('LT');

  let start_time_to_cal = CommonService.convertMinsToHrsMins(shiftTimings.shift_start_time)
  let end_time_to_cal = CommonService.convertMinsToHrsMins(shiftTimings.shift_end_time)

  // duration
  const start_time_to_get_duration = moment().startOf('day').add(shiftTimings.shift_start_time, 'minutes');
  let end_time_to_get_duration = moment().startOf('day').add(shiftTimings.shift_end_time, 'minutes');
  if (start_time_to_cal > end_time_to_cal) {
    end_time_to_get_duration = moment(end_time_to_get_duration).add(1, 'day')
  }

  return (
    <TableRow>
      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={start_time_to_show}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={end_time_to_show}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={shiftTimings.shift_type}
          disabled
        />
      </td>

      <td>
        <TextField
          InputProps={{
            disableUnderline: true,
          }}
          value={CommonService.durationBetweenTimeStamps(
            start_time_to_get_duration,
            end_time_to_get_duration
          )}
          disabled
        />
      </td>

      <td>
        <IconButton onClick={() => handleDeleteClick(shiftTimings?._id)}>
          <DeleteIcon className="delete-icon" />
        </IconButton>
      </td>
    </TableRow>
  );
};

export default ReadOnlyRow;
