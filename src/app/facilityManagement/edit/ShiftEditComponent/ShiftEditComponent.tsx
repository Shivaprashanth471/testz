import {
  Button, Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { useState } from "react";
import CustomSelect from "../../../../components/shared/CustomSelect";
import CustomTextField from "../../../../components/shared/CustomTextField";
import { ENV } from "../../../../constants";
import { shiftType } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ShiftEditComponent.scss";


type ShiftEditComponentProps = {
  timezone: any;
  onAddShift: any;
  facilityId: string;
  getShiftDetails: () => void;
  shiftTimings: any;
  setShiftTimings: any;
};

const ShiftEditComponent = ({
  timezone,
  facilityId,
  getShiftDetails,
  shiftTimings,
  setShiftTimings,
  onAddShift,
}: ShiftEditComponentProps) => {
  const [isShifts, setIsShifts] = useState<boolean>(false);
  const [addFormData, setAddFormData] = useState<any>({
    shiftStartTime: "",
    shiftEndTime: "",
    shiftType: "",
  });

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
      !addFormData.shiftStartTime ||
      !addFormData.shiftEndTime ||
      !addFormData.shiftType
    ) {
      CommonService.showToast('Please provide shift timings')
      return;
    }

    let isSameTime = CommonService.convertHoursToMinutes(addFormData?.shiftStartTime) === CommonService.convertHoursToMinutes(addFormData?.shiftEndTime)
    if (isSameTime) {
      CommonService.showToast('Shift start time and Shift end time can not be same')
      return
    }

    const newShiftTimings = {
      shift_start_time: CommonService.convertHoursToMinutes(addFormData.shiftStartTime),
      shift_end_time: CommonService.convertHoursToMinutes(addFormData.shiftEndTime),
      shift_type: addFormData.shiftType,
    };

    onAddShift(newShiftTimings).then(() => getShiftDetails());

    //clear state after add
    setAddFormData({
      shiftStartTime: "",
      shiftEndTime: "",
      shiftType: "",
    });

    handleCancelShift()
  };

  const handleCancelShift = () => {
    setIsShifts(false);

    //clear state after cancel
    setAddFormData({
      shiftStartTime: "",
      shiftEndTime: "",
      shiftType: "",
    });
  };

  const handleDeleteClick = (shiftId: number) => {
    ApiService.delete(
      ENV.API_URL + "facility/" + facilityId + "/shift/" + shiftId
    )
      .then((resp: any) => {
        CommonService.showToast('Facility Shift Timing Deleted', 'error')
        getShiftDetails();
      })
      .catch((err) => {
        console.log(err);
      });
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
            </TableRow>
          </TableHead>
          <TableBody>
            {shiftTimings.map((shiftTiming: any) => (
              <ReadOnlyRow
                timezone={timezone}
                key={shiftTiming?._id}
                shiftTimings={shiftTiming}
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
              name="shiftStartTime"
              label="Shift Start Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleAddFormChange}
              id="input_shift_add_shift_start_time"
            />
            <CustomTextField
              required
              type="time"
              value={addFormData.shift_end_time}
              name="shiftEndTime"
              label="Shift End Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleAddFormChange}
              id="input_shift_add_shift_end_time"
            />
            <CustomSelect
              placeholder="Shift Type"
              variant='outlined'
              required
              name="shiftType"
              label="Shift Type"
              value={addFormData.shiftType}
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

export default ShiftEditComponent;
