import React, { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../../../constants';
import { CommonService, Communications } from '../../../../helpers';
import './ShiftCompletedViewScreen.scss';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Button } from "@material-ui/core";
import moment from 'moment';
import ShiftTimeline from '../../timeline/ShiftTimeline';
import LoaderComponent from '../../../../components/LoaderComponent';

const ShiftCompletedViewScreen = () => {
    const param = useParams<any>()
    const { id } = param;
    const [basicDetails, setBasicDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getShiftDetails = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'shift/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        getShiftDetails()
    }, [getShiftDetails])
    useEffect(() => {
        Communications.pageTitleSubject.next('Shifts Completed');
        Communications.pageBackButtonSubject.next('/completedShifts/list');
    }, [])


    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.expected?.shift_start_time, basicDetails?.expected?.shift_end_time)
    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    if (isLoading) {
        return <LoaderComponent />
    }

    return <div className="shift-completed-view screen crud-layout pdd-30">

        {!isLoading && (<>
            <div className="pdd-0 custom-border">
                <div className="d-flex pdd-20 hcp-photo-details-wrapper">
                    <div className="d-flex">
                        <div className="flex-1">
                            <Avatar style={{ height: '80px', width: '80px' }} >{basicDetails?.hcp_user?.first_name?.toUpperCase().charAt('0')}</Avatar>
                        </div>
                        <div className="hcp-name-type">
                            <h2>{basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}</h2>
                            <p>{basicDetails?.hcp_user?.hcp_type}</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex hcp-details pdd-bottom-20 custom-border " style={{ gap: "20px" }}>
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
            <div className="d-flex facility-details mrg-top-10 custom-border">
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
            <div className="facility-details mrg-top-10 custom-border">
                <div className="d-flex shift-name-requested">
                    <h2>Shift Details</h2>
                    <div className="d-flex requested-on-wrapper">
                        <h3>Created On:</h3>
                        <p className="mrg-left-10">{moment(basicDetails?.created_at).format("MM-DD-YYYY")}</p>
                    </div>
                </div>
                <p>{basicDetails?.title}</p>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>Required On:</h3>
                        <p>{shift_date}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Time</h3>
                        <p>{start_time} &nbsp;-&nbsp;{end_time}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Time Type:</h3>
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
            <div className="mrg-top-10 custom-border pdd-top-10">
                <div className="shift-name-requested">
                    <div className='d-flex'>
                        <h2 className='flex-1'>Shift Timings</h2>
                        <h4 className="hcp-rate">HCP Rate:<span className="mrg-left-10 ">{basicDetails?.hcp_user?.rate} $</span></h4>
                    </div>
                    <div className="d-flex shift-date-time">
                        <div className="d-flex flex-1">
                            <h3>Attended On:</h3>
                            <p className="attended-date mrg-left-15">{moment(basicDetails?.actuals?.shift_start_time).format("MM-DD-YYYY")}</p>
                        </div>
                        <div className="flex-1 d-flex shift-ot-time">
                            <h3>OT Hours:</h3>
                            <p className="attended-date mrg-left-15">--</p>
                        </div>
                    </div>
                    <div className='pdd-bottom-45'>
                        <ShiftTimeline timeBreakup={basicDetails?.time_breakup} />
                    </div>
                </div>
            </div>

        </>)}
    </div>
}



export default ShiftCompletedViewScreen;