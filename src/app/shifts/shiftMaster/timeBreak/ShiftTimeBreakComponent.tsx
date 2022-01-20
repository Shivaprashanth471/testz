import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TimePicker } from '@material-ui/pickers';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import moment from 'moment';
import { CommonService } from '../../../../helpers';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import { ENV } from '../../../../constants';
import { useParams } from 'react-router';

export interface ShiftTimeBreakComponentProps {
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


const ShiftTimeBreakComponent = (props: PropsWithChildren<ShiftTimeBreakComponentProps>) => {
    const param = useParams<any>();
    const { id } = param;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const classes = useStyles();
    const shiftDetails = props?.shiftDetails;
    const [shiftBreakTimings, setShiftBreakTimings] = useState<any | null>([{ break_in_time: null, break_out_time: null }])
    const [checkIn, setCheckIn] = useState<any | null>(null);
    const [checkOut, setCheckOut] = useState<any | null>(null);
    const [isCheckIn,setIsCheckIn] = useState<boolean>(false);
    const [isCheckOut,setIsCheckOut] = useState<boolean>(false);
    const [isBreak,setIsBreak] = useState<boolean>(false);
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);

    function formattedTime(time: any) {
        let timeInMins = CommonService.convertHoursToMinutes(time);
        return moment().startOf('day').add(timeInMins, 'minutes')
    }

    const handleAddBreakTime = useCallback(() => {
        let data = { break_in_time: null, break_out_time: null }
        setShiftBreakTimings((prevState: any) => [...prevState, data]);
    }, [setShiftBreakTimings])

    const handleDeleteBreakTime = useCallback((deleteIndex: any) => {
        let data = shiftBreakTimings?.filter((item: any, index: any) => index !== deleteIndex);
        setShiftBreakTimings([...data]);
    }, [setShiftBreakTimings, shiftBreakTimings])

    const handleBreakoutChange = useCallback((event: any, index: any) => {
        const data = shiftBreakTimings;
        let value = moment(event).format("HH:mm:ss");
        console.log(data[index]?.break_out_time, data[index], value);
        data[index] = { break_in_time: data[index]?.break_in_time, break_out_time: value }
        setShiftBreakTimings([...data])
    }, [setShiftBreakTimings, shiftBreakTimings])

    const handleBreakInChange = useCallback((event: any, index: any) => {
        const data = shiftBreakTimings;
        let value = moment(event).format("HH:mm:ss");
        data[index] = { break_in_time: value, break_out_time: data[index]?.break_out_time }
        setShiftBreakTimings([...data]);
    }, [setShiftBreakTimings, shiftBreakTimings])

    const handleBreakTimings = useCallback(() => {
        let data = shiftBreakTimings;
        data.forEach((item: any, index: any) => {
            if (item?.break_in_time !== null || item?.break_out_time !== null) {
                if (item?.break_in_time !== null) {
                    let dateTimeBreakIn = CommonService.convertHoursToMinutes(item?.break_in_time);
                    data[index].break_in_time = dateTimeBreakIn.toString();
                } else {
                    delete data[index].break_in_time;
                }
                if (item?.break_out_time !== null) {
                    let dateBreakOut = CommonService.convertHoursToMinutes(item?.break_out_time);
                    data[index].break_out_time = dateBreakOut.toString();
                } else {
                    delete data[index].break_out_time;
                }
            } else {
                data.splice(index, 1);
            }
        })
        console.log(data)

        if (data?.length > 0) {
            let payload = {
                "hcp_user_id": shiftDetails?.hcp_user_id,
                "break_timings": data
            }
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/webBreak', payload).then((resp) => {
                setIsBreak(true)
            }).catch((err) => {
                console.log(err)
            })
        }else{
            data.push({ break_in_time: null, break_out_time: null })
            setIsBreak(true)
        }
    
    }, [id, shiftBreakTimings, shiftDetails?.hcp_user_id])

    const handleCheckInCheckOut = useCallback((type: any, value: any) => {
        let dateTime = CommonService.convertHoursToMinutes(value);
        let payload = {
            "hcp_user_id": shiftDetails?.hcp_user_id,
            "type": type === "checkIn" ? "check_in" : "check_out",
            "time": dateTime.toString()
        }
        let shiftDetailsValue = type === "checkIn" ? shiftDetails?.time_breakup?.check_in_time : shiftDetails?.time_breakup?.check_out_time;
        if (shiftDetailsValue === "") {
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/webCheckInOut', payload).then((resp) => {
              if(type==="checkIn"){
                setIsCheckIn(true)
              }else{
                  setIsCheckOut(true)
              }
            }).catch((err) => {
                console.log(err)
            })
        } else {
            CommonService._api.put(ENV.API_URL + 'shift/' + id + '/webCheckInOut', payload).then((resp) => {
                if(type==="checkIn"){
                    setIsCheckIn(true)
                  }else{
                      setIsCheckOut(true)
                  }
            }).catch((err) => {
                console.log(err)
                CommonService.showToast(err.msg || "Error", "error");
            })
        }
    }, [shiftDetails?.time_breakup?.check_in_time, shiftDetails?.time_breakup?.check_out_time, shiftDetails?.hcp_user_id, id])

    const handleShiftBreaks = useCallback(() => {
        setIsSubmitting(true)
        if (checkIn !== null) {
            handleCheckInCheckOut("checkIn", checkIn)
        }else{
            setIsCheckIn(true)
        }
        if (checkOut !== null) {
            handleCheckInCheckOut("checkOut", checkOut)
        }else{
            setIsCheckOut(true)
        }
        handleBreakTimings()
    }, [handleCheckInCheckOut,handleBreakTimings,checkIn,checkOut])


    useEffect(() => {
        if(isCheckIn === true && isCheckOut === true && isBreak === true){
            CommonService.showToast("Shift Timings Updated" || "Success", "success");
            afterConfirm()
            setIsSubmitting(false)
        }
    }, [isCheckIn,isCheckOut,isBreak,afterConfirm])

    console.log(shiftBreakTimings, "123456789")

    useEffect(() => {
        if (shiftDetails?.time_breakup?.check_in_time) {
            setCheckIn((shiftDetails?.time_breakup?.check_in_time).slice(11, 19))
        }
        if (shiftDetails?.time_breakup?.check_out_time) {
            setCheckOut((shiftDetails?.time_breakup?.check_out_time).slice(11, 19));
        }
        if (shiftDetails?.time_breakup?.break_timings?.length > 0) {
            let data = shiftDetails?.time_breakup?.break_timings;
            data?.forEach((item: any, index: any) => {
                if (item?.break_in_time) {
                    data[index].break_in_time = (item?.break_in_time).slice(11, 19);
                } else {
                    data[index].break_in_time = null;
                }
                if (item?.break_out_time) {
                    data[index].break_out_time = (item?.break_out_time).slice(11, 19);
                } else {
                    data[index].break_out_time = null;
                }
            })
            setShiftBreakTimings(data);
        }
    }, [shiftDetails?.time_breakup?.check_in_time, shiftDetails?.time_breakup?.check_out_time, shiftDetails?.time_breakup?.break_timings])


    return <div className={classes.paper}>
        <DialogContent >
            <h3>Shift Timings</h3>
            <div className="form-field">
                <TimePicker className="mrg-top-10" label="Check In" inputVariant='outlined'
                    value={checkIn ? formattedTime(checkIn) : null}
                    ampm={true} onChange={(event: any) => {
                        let value = moment(event).format("HH:mm:ss")
                        setCheckIn(value);
                    }} fullWidth />
            </div>
            <div className="mrg-top-20">
                {shiftBreakTimings?.map((item: any, index: any) => {
                    return (
                        <div className="d-flex" style={{ gap: "30px" }}>
                            <div className="form-field">
                                <TimePicker className="mrg-top-10" ampm={true} label="Break In" disabled={checkIn===null} inputVariant='outlined' value={shiftBreakTimings[index]?.break_in_time ? formattedTime(shiftBreakTimings[index]?.break_in_time) : null} onChange={(e: any) => handleBreakInChange(e, index)} />
                            </div>
                            <div className="form-field">
                                <TimePicker className="mrg-top-10" ampm={true} label="Break Out" disabled={shiftBreakTimings[index]?.break_in_time===null} inputVariant='outlined' value={shiftBreakTimings[index]?.break_out_time ? formattedTime(shiftBreakTimings[index]?.break_out_time) : null} onChange={(e: any) => handleBreakoutChange(e, index)} />
                            </div>
                            <div className="d-flex">
                                {
                                    index !== 0 ? <div style={{ margin: "auto" }}>
                                        <DeleteOutlineIcon onClick={() => handleDeleteBreakTime(index)} /></div> :
                                        shiftBreakTimings[shiftBreakTimings?.length-1]?.break_in_time!==null && shiftBreakTimings[shiftBreakTimings?.length-1]?.break_out_time!==null?
                                        <div style={{ margin: "auto" }} className="d-flex"><AddCircleOutlineIcon onClick={handleAddBreakTime} /></div>:
                                        <div style={{ margin: "auto" }} className="d-flex"><AddCircleOutlineIcon /></div>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="form-field">
                <TimePicker className="mrg-top-40" label="Check Out" inputVariant='outlined'
                    value={checkOut ? formattedTime(checkOut) : null}
                    disabled={checkIn===null}
                    ampm={true} onChange={(event: any) => {
                        let value = moment(event).format("HH:mm:ss")
                        setCheckOut(value);
                    }} fullWidth />
            </div>
        </DialogContent>

        <DialogActions className="mrg-top-20">
            <Button color="secondary" onClick={afterCancel}>
                {'Cancel'}
            </Button>
            <Button type={"submit"} onClick={handleShiftBreaks} disabled={isSubmitting} className={"submit"} variant={"contained"} color="secondary" autoFocus>
                {'Save'}
            </Button>
        </DialogActions>
    </div >;
}

export default ShiftTimeBreakComponent;
