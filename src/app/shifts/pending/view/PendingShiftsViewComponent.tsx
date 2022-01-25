import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import { Avatar } from "@material-ui/core";
import moment from 'moment';
import './PendingShiftsViewComponent.scss';
import LoaderComponent from '../../../../components/LoaderComponent';

export interface PendingShiftsViewComponentProps {
    cancel: () => void,
    confirm: () => void,
    requirementId: string,
    hcpId: string,
}

const PendingShiftsViewComponent = (props: PropsWithChildren<PendingShiftsViewComponentProps>) => {
    const requirementId = props?.requirementId;
    const hcpId = props?.hcpId;
    const [basicDetails, setBasicDetails] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hcpUserDetails, setHcpUserDetails] = useState<any>(null);

    const getHcpUserDetails = useCallback(() => {
        // config
        setIsLoading(true)
        CommonService._api.get(ENV.API_URL + 'hcp/user/' + hcpId).then((resp) => {
            setHcpUserDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [hcpId])

    const init = useCallback(() => {
        setIsLoading(true)
        CommonService._api
            .get(ENV.API_URL + `shift/requirement/${requirementId}`)
            .then((resp) => {
                setBasicDetails(resp?.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [requirementId]);

    useEffect(() => {
        init()
        getHcpUserDetails()
    }, [init, getHcpUserDetails])
    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.shift_timings?.start_time, basicDetails?.shift_timings?.end_time)
    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    if (isLoading) {
        return <div className='pending-shifts-view screen pdd-100'>
            <LoaderComponent position='block' />
        </div>
    }

    return <div className='pending-shifts-view screen crud-layout pdd-50'>
        {
            !isLoading && <div>
                <div className="pdd-0 custom-border">
                    <div className="d-flex pdd-20 hcp-photo-details-wrapper">
                        <div className="d-flex">
                            <div className="flex-1">
                                <Avatar style={{ height: '80px', width: '80px' }} >{hcpUserDetails?.first_name?.toUpperCase().charAt('0')}</Avatar>
                            </div>
                            <div className="hcp-name-type">
                                <h2>{hcpUserDetails?.first_name}&nbsp;{hcpUserDetails?.last_name}</h2>
                                <p>{hcpUserDetails?.hcp_type}</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex hcp-details pdd-bottom-20 custom-border " style={{ gap: "20px" }}>
                        <div className="flex-1">
                            <h4>Years Of Experience</h4>
                            <p>{hcpUserDetails?.experience ? hcpUserDetails?.experience + " Years" : "N/A"}</p>
                        </div>
                        <div className="flex-1">
                            <h4>Contact Number</h4>
                            <p>{hcpUserDetails?.contact_number}</p>
                        </div>
                        <div className="flex-1">
                            <h4>Address</h4>
                            <p>{hcpUserDetails?.address?.region},&nbsp;{hcpUserDetails?.address?.city},&nbsp;{hcpUserDetails?.address?.state},&nbsp;{hcpUserDetails?.address?.country},&nbsp;{hcpUserDetails?.address?.zip_code}&nbsp;&nbsp;</p>
                        </div>
                        <div className="flex-1">
                            <h4>Email</h4>
                            <p>{hcpUserDetails?.email}</p>
                        </div>
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
                    <p className='mrg-top-0'>{basicDetails?.title}</p>
                    <div className="d-flex shift-details">
                        <div className="flex-1">
                            <h3>Required On:</h3>
                            <p>{shift_date}</p>
                        </div>
                        <div className="flex-1">
                            <h3>Time</h3>
                            <p> {start_time} &nbsp;-&nbsp;{end_time}</p>
                        </div>
                        <div className="flex-1">
                            <h3>No. Of Hcp's</h3>
                            <p> {basicDetails?.hcp_count}</p>
                        </div>
                        <div className="flex-1">
                            <h3>Time Type:</h3>
                            <p>{basicDetails?.shift_type}</p>
                        </div>
                    </div>
                    <div className="d-flex shift-details">
                        <div className="flex-1">
                            <h3>Hcp Type</h3>
                            <p>{basicDetails?.hcp_type}</p>
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

                </div>


            </div>
        }
    </div>;
}

export default PendingShiftsViewComponent;