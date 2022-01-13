
import {
  Button, Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import { nanoid } from 'nanoid';
import React, { useState } from "react";
import CustomSelect from "../../../../components/shared/CustomSelect";
import CustomTextField from "../../../../components/shared/CustomTextField";
import { shiftType } from "../../../../constants/data";
import { CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ShiftAddComponent.scss";


type ShiftAddComponentProps = {
  shiftTimings: any;
  setShiftTimings: any;
};

const ShiftAddComponent = ({
  shiftTimings,
  setShiftTimings,
}: ShiftAddComponentProps) => {
  const [isShifts, setIsShifts] = useState<boolean>(false);
  const [addFormData, setAddFormData] = useState<any>({
    shift_start_time: "",
    shift_end_time: "",
    shift_type: "",
  });

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }

  const handleAddFormChange = (event: any) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData: any = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = (event: any) => {
    event.preventDefault();

    if (
      !addFormData.shift_start_time ||
      !addFormData.shift_end_time ||
      !addFormData.shift_type
    ) {
      CommonService.showToast('Please provide shift timings')
      return;
    }

    let isSameTime = CommonService.convertHoursToMinutes(addFormData.shift_start_time) === CommonService.convertHoursToMinutes(addFormData.shift_end_time)
    if (isSameTime) {
      CommonService.showToast('Shift start time and Shift end time can not be same')
      return
    }

    const newShiftTimings = {
      id: nanoid(),
      shift_start_time: CommonService.convertHoursToMinutes(addFormData.shift_start_time),
      shift_end_time: CommonService.convertHoursToMinutes(addFormData.shift_end_time),
      shift_type: addFormData.shift_type,
    };


    const newShifts = [...shiftTimings, newShiftTimings];
    setShiftTimings(newShifts);

    //clear state
    setAddFormData({
      shift_start_time: "",
      shift_end_time: "",
      shift_type: "",
    });

    handleCancelShift()
    CommonService.showToast('Shift Timing added', 'info')
  };

  const handleCancelShift = () => {
    setIsShifts(false);

    //clear state after cancel
    setAddFormData({
      shift_start_time: "",
      shift_end_time: "",
      shift_type: "",
    });
  };

  const handleDeleteClick = (shiftId: number) => {
    const newShiftTimings = [...shiftTimings];
    const index = shiftTimings.findIndex(
      (shiftTiming: any) => shiftTiming.id === shiftId
    );
    newShiftTimings.splice(index, 1);
    setShiftTimings(newShiftTimings);
    CommonService.showToast('Shift Timing deleted', 'error')
  };


  // function formattedTime(time: any) {
  //   let timeInMins = CommonService.convertHoursToMinutes(time)
  //   return moment().startOf('day').add(timeInMins, 'minutes')
  // }

  return (
    <div className="shift-add-container">
      {shiftTimings.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead>
            <TableRow>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Shift Time</th>
              <th>Duration</th>
              <th>Actions</th>
            </TableRow>
          </TableHead>
          <TableBody>
            {shiftTimings.map((member: any) => (
              <ReadOnlyRow
                key={member.id}
                shiftTimings={member}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {isShifts ? (
        <form onSubmit={handleAddFormSubmit}>
          <div className="shift-add-input">
            <CustomTextField
              required
              type="time"
              value={addFormData.shift_start_time}
              name="shift_start_time"
              label="Shift Start Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleAddFormChange}
              id="input_shift_add_shift_start_time"
            />
            <CustomTextField
              required
              type="time"
              value={addFormData.shift_end_time}
              name="shift_end_time"
              label="Shift End Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleAddFormChange}
              id="input_shift_add_shift_end_time"
            />
            <CustomSelect
              SelectProps={showDropDownBelowField}
              variant='outlined'
              required
              name="shift_type"
              label="Shift Type"
              value={addFormData.shift_type}
              options={shiftType.map(({ value, label }) => ({
                value,
                label,
              }))}
              onChange={handleAddFormChange}
              id="input_shift_add_shift_type"

            />
          </div>
          <div className='shift-add-btn-grp'>
            <Button id='btn_add_shift_cancel' color='primary' variant='outlined' onClick={handleCancelShift}>
              Delete
            </Button>
            <Button id='btn_add_shift_save' variant='contained' color='primary' type="submit">
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="shift-add-action">

          <p
            onClick={() => setIsShifts(true)}
            id="btn_add_shift_submit"
            className="generic-add-multiple"
          >
            + Add a Shift
          </p>
        </div>
      )}

    </div>
  );
};

export default ShiftAddComponent;



