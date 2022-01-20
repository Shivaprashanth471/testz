import React, { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../../../constants';
import { CommonService, Communications } from '../../../../helpers';
import { Button } from "@material-ui/core";
import DialogComponent from "../../../../components/DialogComponent";
import { Tab, Tabs } from '@material-ui/core';
import "./RequirementsShiftsViewScreen.scss";
import AddHcpToShiftScreen from '../view/AddHcpToShift/AddHcpToShiftScreen';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ApprovedHcpApplicationComponent from './approved/ApprovedHcpApplicationComponent';
import UnApprovedHcpApplicationComponent from './unapproved/UnApprovedHcpApplicationComponent';
import RelatedShiftsComponent from './relatedShifts/RelatedShiftsComponent';
import { AddRounded } from '@material-ui/icons';
import RejectShiftRequirementComponent from '../rejectShiftRequirement/RejectShiftRequirementComponent';
import LoaderComponent from '../../../../components/LoaderComponent';

const RequirementsShiftsViewScreen = () => {
    const param = useParams<any>()
    const { id } = param;
    const [tabValue, setTabValue] = useState("approved");
    const [basicDetails, setBasicDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [isRejectShiftOpen, setRejectShiftOpen] = useState<boolean>(false);

    const handleTabChange = (event: any, value: any) => {
        setTabValue(value);
    };

    const getShiftDetails = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'shift/requirement/' + id).then((resp) => {
            setBasicDetails(resp?.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        getShiftDetails()
    }, [getShiftDetails])

    const openAdd = useCallback(() => {
        setIsAddOpen(true);
    }, [])

    const cancelAdd = useCallback(() => {
        setIsAddOpen(false);
    }, [])

    const confirmAdd = useCallback(() => {
        setIsAddOpen(false);
    }, [])
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
        Communications.pageTitleSubject.next('Open Shifts');
        Communications.pageBackButtonSubject.next('/shiftrequirementMaster/list');
    }, [])

    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.shift_timings?.start_time, basicDetails?.shift_timings?.end_time)
    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    if (isLoading) {
        return <LoaderComponent />
    }

    return <div className="pending-shifts-view screen crud-layout pdd-30">

        <DialogComponent open={isRejectShiftOpen} cancel={cancelRejectShift}>
            <RejectShiftRequirementComponent cancel={cancelRejectShift} confirm={confirmRejectShift} />
        </DialogComponent>
        <DialogComponent open={isAddOpen} cancel={cancelAdd}>
            <AddHcpToShiftScreen cancel={cancelAdd} confirm={confirmAdd} hcp_type={basicDetails?.hcp_type} />
        </DialogComponent>

        {!isLoading && (<>
            <div className="header">
                <div className="filter"></div>
                <div className="actions">
                    {basicDetails?.status !== "cancelled" ?
                        <Button variant={"contained"} onClick={openRejectShift} color={"primary"} >
                            Cancel Shift Requirement
                        </Button> : <p className='status-header'>Status:&nbsp;<span className='status'>Cancelled</span></p>}
                </div>
            </div>
            <div className="facility-details custom-border">
                <h2>{basicDetails?.facility?.facility_name}</h2>
                <p>{basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;{basicDetails?.facility?.address?.zip_code}.</p>
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
                        <h3>HCP Type</h3>
                        <p>{basicDetails?.hcp_type}</p>
                    </div>
                </div>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>No. of HCP's Required</h3>
                        <p>{basicDetails?.hcp_count}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Warning Zone</h3>
                        <p>{basicDetails?.warning_type}</p>
                    </div>
                    <div className="flex-1">
                    </div>
                    <div className="flex-1">
                    </div>
                </div>
                <div className="shift-details">
                    <div>
                        <h3>Shift Requirement Details</h3>
                        <p className='summary'>{basicDetails?.shift_details}</p>
                    </div>
                </div>
            </div>
            <div>
                {basicDetails?.status === "cancelled" ? <div className="mrg-top-10 custom-border pdd-top-10">
                    <div className="">
                        <h2>Reason for Cancellation</h2>
                        <p>{basicDetails?.cancelled_details?.reason}</p>
                    </div>
                    <div className="reject-by-wrapper d-flex">
                        <div>
                            <h3>Cancelled By:</h3>
                            <p>{basicDetails?.cancelled_details?.user_info?.first_name} &nbsp; {basicDetails?.cancelled_details?.user_info?.last_name}</p>
                        </div>
                        <div className="mrg-left-50">
                            <h3>Role:</h3>
                            <p>{basicDetails?.cancelled_details?.user_info?.role}</p>
                        </div>
                    </div>
                </div> : <div></div>}
            </div>
            <div className="header mrg-top-20">
                <div className="filter"></div>
                <div className="actions">
                    <Button variant={"contained"} onClick={openAdd} color={"primary"} disabled={basicDetails?.status === "cancelled"} >
                        <AddRounded />&nbsp;&nbsp; Add Hcp
                    </Button>
                </div>
            </div>
            <div className="hcp_tabs mrg-top-10 custom-border">
                <div className="tabs_header">
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        scrollButtons="auto"
                    >
                        <Tab label="HCP's Approved" value={"approved"} />
                        <Tab label="HCP's Unapproved" value={"rejected"} />
                        <Tab label="Related Shifts" value={"relatedShifts"} />
                    </Tabs>
                </div>
                <div className="mrg-top-10">
                    {tabValue === "approved" && <ApprovedHcpApplicationComponent isAddOpen={isAddOpen} />}
                    {tabValue === "rejected" && <UnApprovedHcpApplicationComponent isAddOpen={isAddOpen} />}
                    {tabValue === "relatedShifts" && <RelatedShiftsComponent isAddOpen={isAddOpen} />}
                </div>

            </div></>)}
    </div>
}

export default RequirementsShiftsViewScreen;