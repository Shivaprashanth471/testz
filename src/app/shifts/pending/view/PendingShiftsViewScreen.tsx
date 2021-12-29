import React, { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../../../constants';
import { CommonService, Communications } from '../../../../helpers';
import './PendingShiftsViewScreen.scss';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { Avatar, Button, CircularProgress } from "@material-ui/core";
// import StarBorderIcon from '@material-ui/icons/StarBorder';
import ShiftTimeline from '../../timeline/ShiftTimeline';
import DialogComponent from '../../../../components/DialogComponent';
import RejectShiftComponent from '../rejectShift/RejectShiftComponent';

const PendingShiftsScreen = () => {
    const param = useParams<any>()
    const { id } = param;
    const [basicDetails, setBasicDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRejectShiftOpen, setRejectShiftOpen] = useState<boolean>(false);
    const getShiftDetails = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'shift/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const openRejectShift = useCallback(() => {
        setRejectShiftOpen(true);
    }, [])

    const cancelRejectShift = useCallback(() => {
        setRejectShiftOpen(false);
        getShiftDetails()
    }, [getShiftDetails])

    const confirmRejectShift = useCallback(() => {
        setRejectShiftOpen(false);
        getShiftDetails()
    }, [getShiftDetails])


    useEffect(() => {
        getShiftDetails()
    }, [getShiftDetails])

    useEffect(() => {
        Communications.pageTitleSubject.next('Approved Shifts');
        Communications.pageBackButtonSubject.next('/approvedShifts/list');
    }, [])

    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.expected?.shift_start_time, basicDetails?.expected?.shift_end_time)
    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    return <div className="pending-shifts-view screen crud-layout pdd-30">
        <DialogComponent open={isRejectShiftOpen} cancel={cancelRejectShift}>
            <RejectShiftComponent cancel={cancelRejectShift} confirm={confirmRejectShift} />
        </DialogComponent>
        {isLoading && (
            <div className="view-loading-indicator">
                <CircularProgress color="secondary" className="loader" />
            </div>)}
        {!isLoading && (<>
            <div className="header">
                <div className="filter"></div>
                <div className="actions">
                    {basicDetails?.shift_status !== "cancelled" ?
                        <Button variant={"contained"} onClick={openRejectShift} color={"primary"} >
                            Cancel Shift
                        </Button> : <></>}
                </div>
            </div>
            <div className="pdd-0 custom-border">
                <div className="d-flex pdd-20 hcp-photo-details-wrapper">
                    <div className="d-flex">
                        <div className="flex-1">
                            <Avatar alt="user photo" style={{ height: '80px', width: '80px' }} >{basicDetails?.hcp_user?.first_name?.toUpperCase().charAt('0')}</Avatar>
                        </div>
                        <div className="hcp-name-type">
                            <h2>{basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}</h2>
                            <p>{basicDetails?.hcp_user?.hcp_type}</p>
                        </div>
                    </div>
                    <div className="ratings">
                        <h4>Average Rating</h4>
                        <p>4.42/5</p>
                    </div>
                </div>
                <div className="d-flex hcp-details pdd-bottom-20 custom-border " style={{gap:"20px"}}>
                    <div className="flex-1">
                        <h4>Years Of Experience</h4>
                        <p>{basicDetails?.hcp_user?.experience ? basicDetails?.hcp_user?.experience + " Years" : "N/A"}</p>
                    </div>
                    <div className="flex-1">
                        <h4>Contact Number</h4>
                        <p>{basicDetails?.hcp_user?.contact_number}</p>
                    </div>
                    <div className="flex-1">
                        <h4>Address</h4>
                        <p>{basicDetails?.hcp_user?.address?.region},&nbsp;{basicDetails?.hcp_user?.address?.city},&nbsp;{basicDetails?.hcp_user?.address?.state},&nbsp;{basicDetails?.hcp_user?.address?.country},&nbsp;{basicDetails?.hcp_user?.address?.zip_code}&nbsp;&nbsp;</p>
                    </div>
                    <div className="flex-1">
                        <h4>Email</h4>
                        <p>{basicDetails?.hcp_user?.email}</p>
                    </div>
                    <div className="flex-1">
                        <h4>HCP Rate (hr)</h4>
                        <p>{basicDetails?.hcp_user?.rate} $</p>
                    </div>
                </div>
            </div>
            <div className="d-flex facility-details mrg-top-25 custom-border">
                <div className="flex-1">
                    <h2>{basicDetails?.facility?.facility_name}</h2>
                    <p>{basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;{basicDetails?.facility?.address?.zip_code}.</p>
                </div>
                <div className="flex-1 actions-wrapper">
                    <div className="button"><Button
                        component={Link}
                        color={"primary"}
                        variant={"outlined"}
                        to={"/facility/view/" + basicDetails?.facility?._id}
                    >
                        View Details
                    </Button></div>
                </div>
            </div>
            <div className="mrg-top-25 custom-border">
                <div className="d-flex shift-name-requested pdd-top-10">
                    <h2>Shift Details</h2>
                    <div className="d-flex requested-on-wrapper">
                        <h3>Created On:</h3>
                        <p className="mrg-left-10">{moment(basicDetails?.created_at).format("MM-DD-YYYY")}</p>
                    </div>
                </div>
                <p>{basicDetails?.title}</p>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>Required On</h3>
                        <p>{shift_date}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Time</h3>
                        <p> {start_time} &nbsp;-&nbsp;{end_time}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Shift Type</h3>
                        <p>{basicDetails?.shift_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Warning Zone</h3>
                        <p>{basicDetails?.warning_type}</p>
                    </div>
                </div>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>HCP Differential Rate</h3>
                        <p>{basicDetails?.payments?.differential}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Hourly Rate</h3>
                        <p>{basicDetails?.payments?.hourly_hcp}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP OT Hourly Rate</h3>
                        <p>{basicDetails?.payments?.hourly_ot}</p>
                    </div>
                    <div className="flex-1">

                    </div>
                </div>
            </div>

            <div className="mrg-top-25 custom-border pdd-top-10">
                <div className="shift-name-requested">
                    <div className='d-flex'>
                        <h2 className='flex-1'>Shift Timings</h2>
                        <h4 className="hcp-rate">HCP Rate:<span className="mrg-left-10 ">{basicDetails?.hcp_user?.rate} $</span></h4>
                    </div>
                    <div className="d-flex shift-date-time">
                        <div className="d-flex flex-1">
                            <h3>Attended On:</h3>
                            <p className="attended-date mrg-left-20">{basicDetails?.actuals?.shift_start_time ? moment(basicDetails?.actuals?.shift_start_time).format("MM-DD-YYYY") : "--"}</p>
                        </div>
                        <div className="flex-1 d-flex shift-ot-time">
                            <h3>OT Hours:</h3>
                            <p className="attended-date mrg-left-20">--</p>
                        </div>
                    </div >
                    <div className="pdd-bottom-20">
                        <ShiftTimeline timeBreakup={basicDetails?.time_breakup} />
                    </div>
                </div>
                {/* <div className="feedback-rating-wrapper mrg-top-25">
                    <h3>Feedback:</h3>
                    <div className="d-flex">
                        {
                            [1, 2, 3, 4, 5]?.map((item: any, index: any) => {
                                return (
                                    <div className="mrg-right-15" key={index}><StarBorderIcon color={"primary"} /></div>
                                )
                            })
                        }
                    </div>
                    <div className="mrg-top-20">
                        <TextField
                            placeholder="Please write your review here.."
                            variant='outlined'
                            color={"primary"}
                            type={"text"}
                            name="shift_details"
                            disabled
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </div>
                </div> */}
            </div>
        </>)}

    </div>
}



export default PendingShiftsScreen;