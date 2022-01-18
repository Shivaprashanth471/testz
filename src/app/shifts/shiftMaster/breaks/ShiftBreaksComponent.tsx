import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { CommonService } from '../../../../helpers';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import { TimePicker, DatePicker } from '@material-ui/pickers';
import { ENV } from '../../../../constants';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

export interface ShiftBreaksComponentProps {
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


const ShiftBreaksComponent = (props: PropsWithChildren<ShiftBreaksComponentProps>) => {
    const param = useParams<any>();
    const { id } = param;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const classes = useStyles();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [checkIn, setCheckIn] = useState<any | null>({ date: null, time: null });
    const [shiftBreakTimings, setShiftBreakTimings] = useState<any | null>([{ break_in_date: null, break_in_time: null, break_out_time: null, break_out_date: null }])
    let shiftDetails = Object.assign({}, props?.shiftDetails);


    useEffect(() => {
        if (shiftDetails?.time_breakup?.check_in_time) {
            setCheckIn({ date: shiftDetails?.time_breakup?.check_in_time.slice(0, 10), time: shiftDetails?.time_breakup?.check_in_time.slice(11, 19) })
        }
    }, [shiftDetails?.time_breakup?.check_in_time])

    const handleAddBreakTime = useCallback(() => {
        let data = { break_in_date: null, break_in_time: null, break_out_time: null, break_out_date: null }
        setShiftBreakTimings((prevState: any) => [...prevState, data]);
    }, [setShiftBreakTimings])

    const handleDeleteBreakTime = useCallback((deleteIndex: any) => {
        let data = shiftBreakTimings?.filter((item: any, index: any) => index !== deleteIndex);
        setShiftBreakTimings([...data]);
    }, [setShiftBreakTimings, shiftBreakTimings])

    console.log(shiftBreakTimings)
    const handleBreakoutChange = useCallback((event: any, index: any) => {
        let breakOutDate = moment(shiftBreakTimings[index]?.break_out_date)
        let breakInDate = moment(shiftBreakTimings[index]?.break_in_date);
    
        let error = false
        if (breakInDate < breakOutDate) {         
        } else if (breakInDate > breakOutDate) {
          
        } else {
            let value = moment(event).format("HH:mm:ss");
            let beginningTime = moment(value, 'HH:mm:ss');
            let endTime = moment(shiftBreakTimings[index]?.break_in_time, 'HH:mm:ss')
            if (beginningTime.isBefore(endTime)) {
                error = true
            }
            let checkoutTime = shiftDetails?.time_breakup?.check_out_time.slice(11, 19);
            let currBreakOutTime = index !== shiftBreakTimings?.length-1 ? moment(shiftBreakTimings[index+1]?.break_in_time, 'HH:mm:ss'): moment(checkoutTime, 'HH:mm:ss')
            if(currBreakOutTime.isBefore(beginningTime)){
                 error = true
             }
           
        }

        if (error) {
            CommonService.showToast("Break Out Time has to be greater than Previous Break In Time / less than Next Break In Time" || "Error", "error")
        } else {
            const data = shiftBreakTimings;
            let value = moment(event).format("HH:mm:ss");
            data[index] = {
                break_in_date: data[index]?.break_in_date,
                break_in_time: data[index]?.break_in_time,
                break_out_date: data[index]?.break_out_date,
                break_out_time: value
            }
            setShiftBreakTimings([...data])
        }
    }, [setShiftBreakTimings, shiftBreakTimings,shiftDetails?.time_breakup?.check_out_time])

    const handleBreakInDateChange = useCallback((event: any, index: any) => {
        let breakInDate = moment(event).format('YYYY-MM-DD');
        let breakOutDate = index === 0 ? moment(checkIn?.date) : moment(shiftBreakTimings[index - 1]?.break_out_date);
        let error = false;

        if (breakOutDate < moment(breakInDate)) {
            // date is past
        } else if (breakOutDate > moment(breakInDate)) {
        } else {
            let beginningTime = moment(shiftBreakTimings[index]?.break_in_time, 'HH:mm:ss');
            let endTime = index === 0 ? moment(checkIn?.time, 'HH:mm:ss') : moment(shiftBreakTimings[index - 1]?.break_out_time, 'HH:mm:ss')
            if (beginningTime.isBefore(endTime)) {
                error = true
            }
        }

        if (error) {
            CommonService.showToast(index === 0 ? "Break In Time has to be greater than Check In Time / less than Break Out Time" :
                "Break In Time has to be greater than Previous Break Out Time  / less than Break Out Time" || "Error", "error")
        } else {
            const data = shiftBreakTimings;
            let value = moment(event).format('YYYY-MM-DD');
            data[index] = {
                break_in_date: value,
                break_in_time: data[index]?.break_in_time,
                break_out_date: data[index]?.break_out_date,
                break_out_time: data[index]?.break_out_time
            }
            setShiftBreakTimings([...data])
        }
    }, [setShiftBreakTimings, shiftBreakTimings, checkIn?.date, checkIn?.time])

    const handleBreakOutDateChange = useCallback((event: any, index: any) => {
        let breakOutDate =  moment(event).format('YYYY-MM-DD')
        let breakInDate = moment(shiftBreakTimings[index]?.break_in_date);
        let error = false
        if (breakInDate < moment(breakOutDate)) {
            // date is past
        } else if (breakInDate > moment(breakOutDate)) {
        } else {
            let beginningTime = moment(shiftBreakTimings[index]?.break_out_time, 'HH:mm:ss');
            let endTime = moment(shiftBreakTimings[index]?.break_in_time, 'HH:mm:ss')
            if (beginningTime.isBefore(endTime)) {
                error = true
            }

        }

        if (error) {
            CommonService.showToast("Break Out Time has to be greater than Break In Time" || "Error", "error")
        } else {
            const data = shiftBreakTimings;
            let value = moment(event).format('YYYY-MM-DD');
            data[index] = {
                break_in_date: data[index]?.break_in_date,
                break_in_time: data[index]?.break_in_time,
                break_out_date: value,
                break_out_time: data[index]?.break_out_time
            }
            setShiftBreakTimings([...data])
        }
    }, [setShiftBreakTimings, shiftBreakTimings])

    const handleBreakInChange = useCallback((event: any, index: any) => {
        let breakInDate = moment(shiftBreakTimings[index]?.break_in_date)
        let breakOutDate = index === 0 ? moment(checkIn?.date) : moment(shiftBreakTimings[index - 1]?.break_out_date);
        let error = false
        if (breakOutDate < breakInDate) {
            // date is past
        } else if (breakOutDate > breakInDate) {
        } else {
            let value = moment(event).format("HH:mm:ss");
            let beginningTime = moment(value, 'HH:mm:ss');
            let currBreakOutTime = moment(shiftBreakTimings[index]?.break_out_time, 'HH:mm:ss')
            let endTime = index === 0 ? moment(checkIn?.time, 'HH:mm:ss') : moment(shiftBreakTimings[index - 1]?.break_out_time, 'HH:mm:ss')
            if (beginningTime.isBefore(endTime)) {
                error = true
            }
            if(currBreakOutTime.isBefore(beginningTime)){
                error = true
            }
        }

        if (error) {
            CommonService.showToast(index === 0 ? "Break In Time has to greater than Check In Time" :
                "Break In Time has to greater than Previous Break Out Time" || "Error", "error")
        } else {
            const data = shiftBreakTimings;
            let value = moment(event).format("HH:mm:ss");
            data[index] = {
                break_in_date: data[index]?.break_in_date,
                break_in_time: value,
                break_out_date: data[index]?.break_out_date,
                break_out_time: data[index]?.break_out_time
            }
            setShiftBreakTimings([...data]);
        }

    }, [setShiftBreakTimings, shiftBreakTimings, checkIn])

    const handleBreakTimings = useCallback(() => {
        setIsSubmitting(true)
        let data = shiftBreakTimings;
        let tempError = ""
        data?.forEach((item: any, index: any) => {
            if (item?.break_in_date === null || item?.break_out_date === null || item?.break_in_time === null || item?.break_out_time === null) {
                tempError = "Please fill all the fields"
            }
        })

        if (tempError) {
            CommonService.showToast(tempError || "Error", "error")
            tempError = ""
        } else {
            data.forEach((item: any, index: any) => {
                if (item?.break_in_time !== null) {
                    let dateTimeBreakIn = CommonService.convertHoursToMinutes(item?.break_in_time);
                    data[index].break_in_time = dateTimeBreakIn.toString();
                }
                if (item?.break_out_time !== null) {
                    let dateBreakOut = CommonService.convertHoursToMinutes(item?.break_out_time);
                    data[index].break_out_time = dateBreakOut.toString();
                }
            })
            let payload = {
                "hcp_user_id": shiftDetails?.hcp_user_id,
                "break_timings": data
            }
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/webBreak', payload).then((resp) => {
                if (afterConfirm) {
                    afterConfirm();
                    CommonService.showToast(resp.msg || 'Success', 'success');
                }
            }).catch((err) => {
                console.log(err)
                setIsSubmitting(false)
            })
        }

    }, [id, shiftBreakTimings, shiftDetails?.hcp_user_id, afterConfirm])

    useEffect(() => {
        if (shiftDetails?.time_breakup?.break_timings?.length > 0) {
            let data = shiftDetails?.time_breakup?.break_timings
            data?.forEach((item: any, index: any) => {
                if (item?.break_in_time) {
                    data[index].break_in_date = (item?.break_in_time).slice(0, 10);
                    data[index].break_in_time = (item?.break_in_time).slice(11, 19);
                } else {
                    data[index].break_in_time = null;
                    data[index].break_in_date = null;
                }
                if (item?.break_out_time) {
                    data[index].break_out_date = (item?.break_out_time).slice(0, 10);
                    data[index].break_out_time = (item?.break_out_time).slice(11, 19);
                } else {
                    data[index].break_out_time = null;
                    data[index].break_out_date = null;
                }
                delete data[index]._id;
            })
            setShiftBreakTimings(data);
        }
    }, [shiftDetails?.time_breakup?.break_timings])


    return <div className={classes.paper}>
        <DialogContent >
            <div className="mrg-top-20">
                {shiftBreakTimings?.map((item: any, index: any) => {
                    return (
                        <div>
                            <div className="d-flex" style={{ gap: "10px" }}>
                                <div>
                                    <h3>Break In</h3>
                                    <div className="d-flex form-field" style={{ gap: "30px" }} >
                                        <DatePicker className="mrg-top-10" label="Date" inputVariant='outlined'
                                            value={shiftBreakTimings[index]?.break_in_date}
                                            minDate={index !== 0 ? shiftBreakTimings[index - 1]?.break_out_date : moment(checkIn?.date)}
                                            format="MMMM do yyyy"
                                            onChange={(event: any) => handleBreakInDateChange(event, index)}
                                            maxDate={shiftBreakTimings[index]?.break_out_date || null}
                                            fullWidth required />
                                        <TimePicker className="mrg-top-10" ampm={true} label="Time"
                                            inputVariant='outlined'
                                            disabled={!shiftBreakTimings[index]?.break_in_date}
                                            value={shiftBreakTimings[index]?.break_in_time ? formattedTime(shiftBreakTimings[index]?.break_in_time) : null}
                                            onChange={(e: any) => handleBreakInChange(e, index)}
                                            required fullWidth />
                                    </div>
                                    <div>
                                        <div>
                                            <h3>Break Out</h3>
                                            <div className="d-flex form-field" style={{ gap: "30px" }}>
                                                <DatePicker className="mrg-top-10" label="Date" inputVariant='outlined'
                                                    value={shiftBreakTimings[index]?.break_out_date}
                                                    format="MMMM do yyyy"
                                                    minDate={moment(shiftBreakTimings[index]?.break_in_date)}
                                                    disabled={!shiftBreakTimings[index]?.break_in_date || !shiftBreakTimings[index]?.break_in_time}
                                                    onChange={(event: any) => handleBreakOutDateChange(event, index)}
                                                    maxDate={shiftBreakTimings[index+1]?.break_in_date || shiftDetails?.time_breakup?.check_out_time?.slice(0,10) || null}
                                                    fullWidth required />
                                                <TimePicker className="mrg-top-10" ampm={true} label="Time"
                                                    inputVariant='outlined'
                                                    disabled={!shiftBreakTimings[index]?.break_out_date}
                                                    value={shiftBreakTimings[index]?.break_out_time ? formattedTime(shiftBreakTimings[index]?.break_out_time) : null}
                                                    onChange={(e: any) => handleBreakoutChange(e, index)}
                                                    fullWidth />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    {
                                        index !== 0 ? <div style={{ margin: "auto" }}>
                                            <DeleteOutlineIcon onClick={() => handleDeleteBreakTime(index)} className="mrg-top-50" /></div> :
                                            shiftBreakTimings[shiftBreakTimings?.length - 1]?.break_in_time !== null && shiftBreakTimings[shiftBreakTimings?.length - 1]?.break_out_time !== null ?
                                                <div style={{ margin: "auto" }} className="d-flex"><AddCircleOutlineIcon onClick={handleAddBreakTime} className="mrg-top-50" /></div> :
                                                <div style={{ margin: "auto" }} className="d-flex"><AddCircleOutlineIcon className="mrg-top-50" /></div>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </DialogContent>

        <DialogActions className="mrg-top-20">
            <Button color="secondary" onClick={afterCancel}>
                {'Cancel'}
            </Button>
            <Button type={"submit"} onClick={handleBreakTimings} disabled={isSubmitting} className={"submit"} variant={"contained"} color="secondary" autoFocus>
                {'Save'}
            </Button>
        </DialogActions>
    </div >;
}

export default ShiftBreaksComponent;