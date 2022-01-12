import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { CommonService } from '../../../../helpers';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import { TimePicker, DatePicker } from '@material-ui/pickers';
import { ENV } from '../../../../constants';

export interface ShiftCheckOutComponentProps {
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


const ShiftCheckOutComponent = (props: PropsWithChildren<ShiftCheckOutComponentProps>) => {
    const param = useParams<any>();
    const { id } = param;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [checkOut, setCheckOut] = useState<any | null>({ date: null, time: null });
    const shiftDetails = props?.shiftDetails;
    const [lastBreakOut,setLastBreakOut] = useState<any | null>({ date: null, time: null });
    console.log(shiftDetails)

    const handleCheckInCheckOut = useCallback(() => {
        if(checkOut?.date!==null && checkOut?.time!==null){
        let dateTime = CommonService.convertHoursToMinutes(checkOut?.time);
        let payload = {
            "hcp_user_id": shiftDetails?.hcp_user_id,
            "type": "check_out",
            "time": dateTime.toString(),
            "date":checkOut?.date
        }

        if (shiftDetails?.time_breakup?.check_out_time === "") {
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/webCheckInOut', payload).then((resp) => {
                if (afterConfirm) {
                    afterConfirm();
                    CommonService.showToast(resp.msg || 'Success', 'success');
                }
            }).catch((err) => {
                console.log(err)
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
            })
        }
    }else{
            CommonService.showToast("Please fill all the fields" || "Error","error")
            setIsSubmitting(false)
        }
    }, [shiftDetails?.time_breakup?.check_out_time, shiftDetails?.hcp_user_id, id,checkOut?.date,afterConfirm,checkOut?.time])

    const handleCheckoutTimeChange = useCallback((event: any) => {
        let date = moment(checkOut?.date)
        let now = moment(lastBreakOut?.date)
        let error=false
        console.log(date, now)
        if (now < date) {
            // date is past
        } else if (now > date) {
        } else {
            let value = moment(event).format("HH:mm:ss");
            let beginningTime = moment(value, 'HH:mm:ss');
            let endTime =moment(lastBreakOut?.time,'HH:mm:ss')
            if(beginningTime.isBefore(endTime)){
              error=true
          }
        }

        if(error){
            CommonService.showToast("Check Out Time has to be greater than last break Out Time" || "Error","error")
        }else{
            let value = moment(event).format("HH:mm:ss")
            setCheckOut({ date: checkOut?.date, time: value });
        }
    },[checkOut?.date,lastBreakOut?.date,lastBreakOut?.time])

    
    const handleCheckoutDateChange = useCallback((event: any) => {
        let checkoutDate =moment(event).format('YYYY-MM-DD')
        let now = moment(lastBreakOut?.date)
        let error=false
        if (now < moment(checkoutDate)) {
            // checkoutDate is past
        } else if (now > moment(checkoutDate)) {
        } else {
            let value = moment(event).format("HH:mm:ss");
            let beginningTime = moment(value, 'HH:mm:ss');
            let endTime =moment(lastBreakOut?.time,'HH:mm:ss')
            if(beginningTime.isBefore(endTime)){
              error=true
          }
        }

        if(error){
            CommonService.showToast("Check Out Time has to be greater than last break Out Time" || "Error","error")
        }else{
            let value = moment(event).format("HH:mm:ss")
            setCheckOut({ date: value, time: checkOut?.time });
        }
    },[checkOut?.time,lastBreakOut?.date,lastBreakOut?.time])

    const handleShiftCheckout = useCallback(() => {
        setIsSubmitting(true)
        handleCheckInCheckOut()
    }, [handleCheckInCheckOut])

    
    useEffect(() => {
        if (shiftDetails?.time_breakup?.break_timings[(shiftDetails?.time_breakup?.break_timings?.length)-1]) {
            setLastBreakOut({ date: shiftDetails?.time_breakup?.break_timings[(shiftDetails?.time_breakup?.break_timings?.length)-1]?.break_out_time.slice(0, 10), time: shiftDetails?.time_breakup?.break_timings[(shiftDetails?.time_breakup?.break_timings?.length)-1]?.break_out_time.slice(11, 19) })
        }

    }, [shiftDetails?.time_breakup?.break_timings])

    console.log(shiftDetails?.time_breakup?.break_timings[0],";;;;;;;;;;")
    useEffect(() => {
        if (shiftDetails?.time_breakup?.check_out_time) {
            setCheckOut({date:shiftDetails?.time_breakup?.check_out_time.slice(0, 10),time:shiftDetails?.time_breakup?.check_out_time.slice(11, 19)})
        }
      
    }, [shiftDetails?.time_breakup?.check_out_time])

    return <div className={classes.paper}>
        <DialogContent >
            <h3>Check Out</h3>
            <div className="form-field">
                <DatePicker className="mrg-top-10" label="Date" inputVariant='outlined'
                    value={checkOut?.date}
                    format="MMMM do yyyy"
                    minDate={moment(lastBreakOut?.date)}
                    onChange={(event:any)=>handleCheckoutDateChange(event)} fullWidth required/>
            </div>
            <div className="form-field">
                <TimePicker className="mrg-top-30" label="Time" inputVariant='outlined'
                    value={checkOut?.time ? formattedTime(checkOut?.time) : null}
                    ampm={true} onChange={(event: any) => handleCheckoutTimeChange(event)} fullWidth required/>
            </div>
        </DialogContent>
        <DialogActions className="mrg-top-20">
            <Button color="secondary" onClick={afterCancel}>
                {'Cancel'}
            </Button>
            <Button type={"submit"} onClick={handleShiftCheckout} disabled={isSubmitting} className={"submit"} variant={"contained"} color="secondary" autoFocus>
                {'Save'}
            </Button>
        </DialogActions>
    </div>
}

export default ShiftCheckOutComponent;