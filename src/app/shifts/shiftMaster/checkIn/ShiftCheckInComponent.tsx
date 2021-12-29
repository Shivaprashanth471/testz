import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { CommonService } from '../../../../helpers';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import { TimePicker, DatePicker } from '@material-ui/pickers';
import { ENV } from '../../../../constants';

export interface ShiftCheckInComponentProps {
    cancel: () => void,
    confirm: () => void,
    shiftDetails: any,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(3),
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            padding: "30px 50px",

        }
    }),
);


function formattedTime(time: any) {
    let timeInMins = CommonService.convertHoursToMinutes(time);
    return moment().startOf('day').add(timeInMins, 'minutes')
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

    const handleCheckInCheckOut = useCallback(() => {
        if(checkIn?.date!==null && checkIn?.time!==null){
            let dateTime = CommonService.convertHoursToMinutes(checkIn?.time);
        let payload = {
            "hcp_user_id": shiftDetails?.hcp_user_id,
            "type": "check_in",
            "time": dateTime.toString(),
            "date":checkIn?.date
        }

        if (shiftDetails?.time_breakup?.check_in_time === "") {
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/webCheckInOut', payload).then((resp) => {
                if (afterConfirm) {
                    afterConfirm();
                    CommonService.showToast(resp.msg || 'Success', 'success');
                    
                }
            }).catch((err) => {
                console.log(err)
                setIsSubmitting(true)
            })
        } else {
            CommonService._api.put(ENV.API_URL + 'shift/' + id + '/webCheckInOut', payload).then((resp) => {
                if (afterConfirm) {
                    afterConfirm();
                    CommonService.showToast(resp.msg || 'Success', 'success');
                }
            }).catch((err) => {
                console.log(err)
                CommonService.showToast(err.msg || "Error", "error");
                setIsSubmitting(true)
            })
        }
    }else{
        CommonService.showToast("Please fill all the fields" || "Error","error")
        setIsSubmitting(false)
    }
    }, [shiftDetails?.time_breakup?.check_in_time, shiftDetails?.hcp_user_id, id,checkIn?.date,afterConfirm,checkIn?.time])

    const handleShiftCheckIn = useCallback(() => {
        setIsSubmitting(true)
        handleCheckInCheckOut()
    }, [handleCheckInCheckOut])

    useEffect(() => {
        if (shiftDetails?.time_breakup?.check_in_time) {
            setCheckIn({date:shiftDetails?.time_breakup?.check_in_time.slice(0, 10),time:shiftDetails?.time_breakup?.check_in_time.slice(11, 19)})
        }
      
    }, [shiftDetails?.time_breakup?.check_in_time])

    console.log(checkIn?.date)

    return <div className={classes.paper}>
        <DialogContent >
            <h3>Check In</h3>
            <div className="form-field">
                <DatePicker className="mrg-top-10" label="Date" inputVariant='outlined'
                    value={checkIn?.date}
                    format="MMMM do yyyy"
                    onChange={(event: any) => {
                        let value = moment(event).format('YYYY-MM-DD')
                        setCheckIn({ date: value, time: checkIn?.time });
                    }} fullWidth required />
            </div>
            <div className="form-field">
                <TimePicker className="mrg-top-30" label="Time" inputVariant='outlined'
                    value={checkIn?.time ? formattedTime(checkIn?.time) : null}
                    ampm={true} onChange={(event: any) => {
                        let value = moment(event).format("HH:mm:ss")
                        setCheckIn({ date: checkIn?.date, time: value });
                    }} fullWidth required />
            </div>
        </DialogContent>
        <DialogActions className="mrg-top-20">
            <Button color="secondary" onClick={afterCancel}>
                {'Cancel'}
            </Button>
            <Button type={"submit"} onClick={handleShiftCheckIn} disabled={isSubmitting} className={"submit"} variant={"contained"} color="secondary" autoFocus>
                {'Save'}
            </Button>
        </DialogActions>
    </div>
}

export default ShiftCheckInComponent;