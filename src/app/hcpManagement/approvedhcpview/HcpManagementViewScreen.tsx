// import HcpAssessmentRatingComponent from "./assessmentRatings/HcpAssessmentRatingComponent";
// import HcpContractComponent from "./contract/HcpContractComponent";
import { Button } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import LoaderComponent from "../../../components/LoaderComponent";
import { ENV } from "../../../constants";
import { CommonService, Communications } from "../../../helpers";
import HcpDetailsComponent from "./details/HcpDetailsComponent";
import './HcpManagementViewScreen.scss';


const HcpManagementViewScreen = (props:any) => {
    const param = useParams<any>()
    const { id } = param
    const [hcpBasicDetails, setBasicDetails] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAttachmentsLoading, setIsAttachmentsLoading] = useState<boolean>(true)

    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'hcp/user/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        let prevLocation:any="/hcp/user/list";
        if(props?.location.state){
            prevLocation=props?.location.state?.prevPath;
        }
        init();
        Communications.pageTitleSubject.next('HCP Details');
        Communications.pageBackButtonSubject.next(prevLocation);
    }, [init])

    if (isLoading && isAttachmentsLoading) {
        return <LoaderComponent />
    }

    return (
        <div className="pdd-30 screen crud-layout">
            {!isLoading && (<>
                <div className="hcp_view_details">
                    <div className="d-flex profile-status-wrapper">
                        <div>
                            <Button variant={"contained"} color={"primary"} component={Link} to={`/hcp/edit/${hcpBasicDetails?._id}`}>Edit HCP</Button>
                        </div>
                    </div>
                    <div className="mrg-top-20">
                        <HcpDetailsComponent setIsAttachmentsLoading={setIsAttachmentsLoading} />
                    </div>

                </div>
            </>)}
            <ScrollToTop smooth color="white" />
        </div>)
}

export default HcpManagementViewScreen;