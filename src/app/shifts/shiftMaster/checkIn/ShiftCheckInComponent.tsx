import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import moment from "moment";
import { CommonService } from "../../../../helpers";
import { Button, DialogActions, DialogContent } from "@material-ui/core";
import { TimePicker, DatePicker } from "@material-ui/pickers";
import { ENV } from "../../../../constants";

export interface ShiftCheckInComponentProps {
  cancel: () => void;
  confirm: () => void;
  shiftDetails: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      padding: "30px 50px",
    },
  })
);

function formattedTime(time: any) {
  let timeInMins = CommonService.convertHoursToMinutes(time);
  return moment().startOf("day").add(timeInMins, "minutes");
}

const ShiftCheckInComponent = (props: PropsWithChildren<ShiftCheckInComponentProps>) => {
  const param = useParams<any>();
  const { id } = param;
  const afterCancel = props?.cancel;
  const afterConfirm = props?.confirm;
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkIn, setCheckIn] = useState<any | null>({ date: null, time: null });
  const shiftDetails = props?.shiftDetails;
  const [firstBreakIn, setFirstBreakIn] = useState<any | null>({ date: null, time: null });

  const handleChangeCheckInDate = useCallback(
    (event: any) => {
      let checkInDate = moment(event).format("YYYY-MM-DD");
      let now = moment(firstBreakIn?.date);
      let error = false;
      if (now < moment(checkInDate)) {
        // checkInDate is past
      } else if (now > moment(checkInDate)) {
      } else {
        let beginningTime = moment(checkIn?.time, "HH:mm:ss");
        let endTime = moment(firstBreakIn?.time, "HH:mm:ss");
        if (endTime.isBefore(beginningTime)) {
          error = true;
        }
      }

      if (error) {
        CommonService.showToast("Check In Time has to be smaller than First break In Time / Check Out Time" || "Error", "error");
      } else {
        let value = moment(event).format("YYYY-MM-DD");
        setCheckIn({ date: value, time: checkIn?.time });
      }
    },
    [firstBreakIn?.date, firstBreakIn?.time, checkIn?.time]
  );

  useEffect(() => {
    if (shiftDetails?.time_breakup?.break_timings[0]) {
      setFirstBreakIn({ date: shiftDetails?.time_breakup?.break_timings[0]?.break_in_time.slice(0, 10), time: shiftDetails?.time_breakup?.break_timings[0]?.break_in_time.slice(11, 19) });
    } else {
      setFirstBreakIn({ date: shiftDetails?.time_breakup?.check_out_time?.slice(0, 10), time: shiftDetails?.time_breakup?.check_out_time.slice(11, 19) });
    }
  }, [shiftDetails?.time_breakup?.break_timings, shiftDetails?.time_breakup?.check_out_time]);

  const handleChangeCheckInTime = useCallback(
    (event: any) => {
      let date = moment(checkIn?.date);
      let now = moment(firstBreakIn?.date);
      let error = false;
      if (now < date) {
        // date is past
      } else if (now > date) {
      } else {
        let value = moment(event).format("HH:mm:ss");
        let beginningTime = moment(value, "HH:mm:ss");
        let endTime = moment(firstBreakIn?.time, "HH:mm:ss");
        if (endTime.isBefore(beginningTime)) {
          error = true;
        }
      }

      if (error) {
        CommonService.showToast("Check In Time has to be smaller than First break In Time / Check Out Time" || "Error", "error");
      } else {
        let value = moment(event).format("HH:mm:ss");
        setCheckIn({ date: checkIn?.date, time: value });
      }
    },
    [firstBreakIn?.date, firstBreakIn?.time, checkIn?.date]
  );

  const handleCheckInCheckOut = useCallback(() => {
    if (checkIn?.date !== null && checkIn?.time !== null) {
      let dateTime = CommonService.convertHoursToMinutes(checkIn?.time);
      let payload = {
        hcp_user_id: shiftDetails?.hcp_user_id,
        type: "check_in",
        time: dateTime.toString(),
        date: checkIn?.date,
      };

      if (shiftDetails?.time_breakup?.check_in_time === "") {
        CommonService._api
          .post(ENV.API_URL + "shift/" + id + "/webCheckInOut", payload)
          .then((resp) => {
            if (afterConfirm) {
              afterConfirm();
              CommonService.showToast(resp.msg || "Success", "success");
            }
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(true);
          });
      } else {
        CommonService._api
          .put(ENV.API_URL + "shift/" + id + "/webCheckInOut", payload)
          .then((resp) => {
            if (afterConfirm) {
              afterConfirm();
              CommonService.showToast(resp.msg || "Success", "success");
            }
          })
          .catch((err) => {
            console.log(err);
            CommonService.showToast(err.msg || "Error", "error");
            setIsSubmitting(true);
          });
      }
    } else {
      CommonService.showToast("Please fill all the fields" || "Error", "error");
      setIsSubmitting(false);
    }
  }, [shiftDetails?.time_breakup?.check_in_time, shiftDetails?.hcp_user_id, id, checkIn?.date, afterConfirm, checkIn?.time]);

  const handleShiftCheckIn = useCallback(() => {
    setIsSubmitting(true);
    handleCheckInCheckOut();
  }, [handleCheckInCheckOut]);

  useEffect(() => {
    if (shiftDetails?.time_breakup?.check_in_time) {
      setCheckIn({ date: shiftDetails?.time_breakup?.check_in_time.slice(0, 10), time: shiftDetails?.time_breakup?.check_in_time.slice(11, 19) });
    }
  }, [shiftDetails?.time_breakup?.check_in_time]);

  // console.log(checkIn?.date)

  return (
    <div className={classes.paper}>
      <DialogContent>
        <h3>Check In</h3>
        <div className="form-field">
          <DatePicker
            className="mrg-top-10"
            label="Date"
            inputVariant="outlined"
            value={checkIn?.date}
            maxDate={shiftDetails?.time_breakup?.break_timings[0]?.break_in_time.slice(0, 10) || shiftDetails?.time_breakup?.check_out_time?.slice(0, 10) || null}
            format="MMMM do yyyy"
            onChange={(event: any) => handleChangeCheckInDate(event)}
            fullWidth
            required
          />
        </div>
        <div className="form-field">
          <TimePicker className="mrg-top-30" label="Time" inputVariant="outlined" value={checkIn?.time ? formattedTime(checkIn?.time) : null} ampm={true} onChange={(event) => handleChangeCheckInTime(event)} fullWidth required />
        </div>
      </DialogContent>
      <DialogActions className="mrg-top-20">
        <Button color="secondary" onClick={afterCancel}>
          {"Cancel"}
        </Button>
        <Button type={"submit"} onClick={handleShiftCheckIn} disabled={isSubmitting} className={isSubmitting ? "has-loading-spinner submit" : "submit"} variant={"contained"} color="secondary" autoFocus>
          {isSubmitting ? "Saving" : "Save"}
        </Button>
      </DialogActions>
    </div>
  );
};

export default ShiftCheckInComponent;
