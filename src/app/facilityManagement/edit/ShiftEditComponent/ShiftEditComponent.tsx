import {
  Button, MenuItem, Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { shiftType } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import { shiftFormValidation } from "../../add/ShiftAddComponent/ShiftTimingFormValidation";
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



const ShiftEditComponent = ({ timezone, facilityId, getShiftDetails, shiftTimings, setShiftTimings, onAddShift, }: ShiftEditComponentProps) => {
  const [isShifts, setIsShifts] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [shiftId, setShiftId] = useState<any>(null);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);


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

    const newShiftTimings = {
      shift_start_time: CommonService.convertHoursToMinutes(shift?.shift_start_time),
      shift_end_time: CommonService.convertHoursToMinutes(shift?.shift_end_time),
      shift_type: shift?.shift_type,
    };

    onAddShift(newShiftTimings).then(() => {
      getShiftDetails();
      handleCloseShiftForm()
      resetForm()
    }).catch((err: any) => {
      console.log(err);
      CommonService.showToast(err?.msg || 'Error', 'error')
    });

  };

  const handleCloseShiftForm = () => {
    setIsShifts(false);
  };

  const handleDeleteClick = useCallback((shiftId: number) => {
    setIsConfirm(true)
    ApiService.delete(
      ENV.API_URL + "facility/" + facilityId + "/shift/" + shiftId
    )
      .then((resp: any) => {
        CommonService.showToast('Facility Shift Timing Deleted', 'success')
        getShiftDetails();
        setIsConfirm(false)
        setIsAddOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setIsConfirm(false)
      });
  }, [facilityId, getShiftDetails])


  const openAdd = useCallback((id: any) => {
    setShiftId(id)
    setIsAddOpen(true);
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    handleDeleteClick(shiftId)
  }, [shiftId, handleDeleteClick])


  return (
    <div className="shift-add-container">
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent cancel={cancelAdd} isConfirm={isConfirm} confirm={confirmAdd} text1='Want to delete' hcpname={'Shift'} groupname={''} confirmationText={''} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>
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
                openAdd={openAdd}
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
                  <Button disabled={isSubmitting} id='btn_add_shift_save' variant='contained' color='primary' type="submit" className={isSubmitting?"has-loading-spinner":""}>
                  {isSubmitting?"Saving":"Save"}
                  </Button>
                </div>
              </Form>
            )
          }
        </Formik>
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
