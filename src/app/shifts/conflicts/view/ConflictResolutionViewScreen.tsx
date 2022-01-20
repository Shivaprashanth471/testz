import React, { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../../../constants';
import { CommonService, Communications } from '../../../../helpers';
import { useParams } from "react-router-dom";
import moment from 'moment';
import './ConflictResolutionViewScreen.scss';
import LoaderComponent from '../../../../components/LoaderComponent';

const ConflictResolutionViewScreen = () => {
    const param = useParams<any>()
    const { id } = param;
    const [basicDetails, setBasicDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
        Communications.pageTitleSubject.next('Conflict Resolution');
        Communications.pageBackButtonSubject.next('/conflicts/list');
    }, [])


    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    if (isLoading) {
        return <LoaderComponent />
    }


    return <div className="shift-cancelled-view screen crud-layout pdd-30">

        {!isLoading && (<>
            <div className="facility-details">
                <h2>Reason For Cancellation</h2>
                <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown ..</p>
            </div>
            <div className="facility-details mrg-top-40">
                <h2>{basicDetails?.facility?.facility_name}</h2>
                <p>{basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;{basicDetails?.facility?.address?.zip_code}.</p>
            </div>
            <div className="facility-details mrg-top-40">
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
                        <p> {moment(basicDetails?.expected?.shift_start_time).format("hh:mm A")} &nbsp;-&nbsp;{moment(basicDetails?.expected?.shift_end_time).format("hh:mm A")}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Time Type:</h3>
                        <p>{basicDetails?.shift_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Name</h3>
                        <p>{basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}</p>
                    </div>
                </div>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>HCP Email</h3>
                        <p>{basicDetails?.hcp_user?.email}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Type</h3>
                        <p>{basicDetails?.hcp_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Warning Zone</h3>
                        <p>{basicDetails?.warning_type}</p>
                    </div>

                    <div className="flex-1">
                        <h3>HCP Rate</h3>
                        <p>{basicDetails?.hcp_user?.rate}</p>
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
        </>)}
    </div>
}


export default ConflictResolutionViewScreen;