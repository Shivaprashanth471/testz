
import {
  Button, MenuItem, Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { nanoid } from 'nanoid';
import React, { useState } from "react";
import { shiftType } from "../../../../constants/data";
import { CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ShiftAddComponent.scss";
import { shiftFormValidation } from "./ShiftTimingFormValidation";


type ShiftAddComponentProps = {
  shiftTimings: any;
  setShiftTimings: any;
};

interface ShiftAddType {
  shift_start_time: string;
  shift_end_time: string;
  shift_type: string;
}

const shiftInitalState: ShiftAddType = {
  shift_start_time: "",
  shift_end_time: "",
  shift_type: "",
}


const ShiftAddComponent = ({
  shiftTimings,
  setShiftTimings,
}: ShiftAddComponentProps) => {
  const [isShifts, setIsShifts] = useState<boolean>(false);
  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }


  const onAdd = (shift: ShiftAddType, { setSubmitting, setErrors, resetForm }: FormikHelpers<ShiftAddType>) => {

    console.log(shift);
    const newShiftTimings = {
      id: nanoid(),
      shift_start_time: CommonService.convertHoursToMinutes(shift?.shift_start_time),
      shift_end_time: CommonService.convertHoursToMinutes(shift?.shift_end_time),
      shift_type: shift?.shift_type,
    };


    const newShifts = [...shiftTimings, newShiftTimings];
    setShiftTimings(newShifts);

    resetForm()
    handleCloseShiftForm()
    CommonService.showToast('Shift Timing added', 'info')
  };

  const handleCloseShiftForm = () => {
    setIsShifts(false);
  };

  const handleDeleteClick = (shiftId: number) => {
    const newShiftTimings = [...shiftTimings];
    const index = shiftTimings.findIndex(
      (shiftTiming: any) => shiftTiming.id === shiftId
    );
    newShiftTimings.splice(index, 1);
    setShiftTimings(newShiftTimings);
    CommonService.showToast('Shift Timing deleted', 'success')
  };



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
            {shiftTimings.map((shiftTiming: any) => (
              <ReadOnlyRow
                key={shiftTiming.id}
                shiftTimings={shiftTiming}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {isShifts ? (
        <Formik
          initialValues={shiftInitalState}
          validateOnChange={true}
          validationSchema={shiftFormValidation}
          onSubmit={onAdd}
        >
          {
            ({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className={"form-holder"} >
                <div className="shift-add-input">
                  <Field
                    fullWidth
                    variant="outlined"
                    type="time"
                    component={TextField}
                    name="shift_start_time"
                    label="Shift Start Time"
                    InputLabelProps={{ shrink: true }}
                    id="input_shift_add_shift_start_time"
                  />
                  <Field
                    fullWidth
                    variant="outlined"
                    type="time"
                    component={TextField}
                    name="shift_end_time"
                    label="Shift End Time"
                    InputLabelProps={{ shrink: true }}
                    id="input_shift_add_shift_end_time"
                  />
                  <Field
                    select
                    fullWidth
                    SelectProps={showDropDownBelowField}
                    variant='outlined'
                    component={TextField}
                    name="shift_type"
                    label="Shift Type"
                    id="input_shift_add_shift_type"

                  >
                    <MenuItem value="" >
                      Select Shift Type
                    </MenuItem>
                    {shiftType.length > 0 &&
                      shiftType.map((item: any, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.label}
                        </MenuItem>
                      ))}
                  </Field>
                </div>
                <div className='shift-add-btn-grp'>
                  <Button id='btn_add_shift_cancel' color='primary' variant='outlined' onClick={handleCloseShiftForm}>
                    Delete
                  </Button>
                  <Button id='btn_add_shift_save' variant='contained' color='primary' type="submit">
                    Save
                  </Button>
                </div>
              </Form>
            )
          }
        </Formik>
      ) : (
        <div className="shift-add-action">
          <Tooltip title={"Add New Shift Timing"}>
            <p
              onClick={() => setIsShifts(true)}
              id="btn_add_shift_submit"
              className="generic-add-multiple"
            >
              + Add a Shift
            </p>
          </Tooltip>
        </div>
      )}

    </div>
  );
};

export default ShiftAddComponent;



