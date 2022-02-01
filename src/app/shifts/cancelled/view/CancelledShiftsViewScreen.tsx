import React, { useCallback, useEffect, useState } from "react";
import { ENV } from "../../../../constants";
import { CommonService, Communications } from "../../../../helpers";
import { useParams } from "react-router-dom";
import "./CancelledShiftsViewScreen.scss";
import moment from "moment";
import { Avatar } from "@material-ui/core";
import LoaderComponent from "../../../../components/LoaderComponent";

const CancelledShiftsViewScreen = () => {
  const param = useParams<any>();
  const { id } = param;
  const [basicDetails, setBasicDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getShiftDetails = useCallback(() => {
    // config
    CommonService._api
      .get(ENV.API_URL + "shift/" + id)
      .then((resp) => {
        setBasicDetails(resp.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    getShiftDetails();
  }, [getShiftDetails]);

  useEffect(() => {
    Communications.pageTitleSubject.next("Shifts Cancelled");
    Communications.pageBackButtonSubject.next("/cancelledShifts/list");
  }, []);

  const shift_date = CommonService.getUtcDate(basicDetails?.shift_date);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="shift-cancelled-view screen crud-layout pdd-30">
      {!isLoading && (
        <>
          <div className="pdd-0 custom-border">
            <div className="d-flex pdd-20 hcp-photo-details-wrapper">
              <div className="d-flex">
                <div className="flex-1">
                  <Avatar alt="user photo" style={{ height: "80px", width: "80px" }} src={"https://images.unsplash.com/photo-1510832198440-a52376950479?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z2lybHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"} />
                </div>
                <div className="hcp-name-type">
                  <h2>
                    {basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}
                  </h2>
                  <p>{basicDetails?.hcp_user?.hcp_type}</p>
                </div>
              </div>
              <div className="ratings"></div>
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
                <p>
                  {basicDetails?.hcp_user?.address?.region},&nbsp;{basicDetails?.hcp_user?.address?.city},&nbsp;{basicDetails?.hcp_user?.address?.state},&nbsp;{basicDetails?.hcp_user?.address?.country},&nbsp;
                  {basicDetails?.hcp_user?.address?.zip_code}&nbsp;&nbsp;
                </p>
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
          <div className="mrg-top-10 custom-border pdd-top-10">
            <div className="">
              <h2>Reason for Cancellation</h2>
              <p>{basicDetails?.cancelled_details?.reason}</p>
            </div>
            <div className="reject-by-wrapper d-flex">
              <div>
                <h3>Cancelled By:</h3>
                <p>
                  {basicDetails?.cancelled_details?.cancelled_by?.first_name} &nbsp; {basicDetails?.cancelled_details?.cancelled_by?.last_name}
                </p>
              </div>
              <div className="mrg-left-50">
                <h3>Role:</h3>
                <p>{basicDetails?.cancelled_details?.cancelled_by?.role}</p>
              </div>
            </div>
          </div>
          <div className="facility-details custom-border mrg-top-10">
            <h2>{basicDetails?.facility?.facility_name}</h2>
            <p>
              {basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;
              {basicDetails?.facility?.address?.zip_code}.
            </p>
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
                <p>
                  {" "}
                  {moment(basicDetails?.expected?.shift_start_time).format("hh:mm A")} &nbsp;-&nbsp;{moment(basicDetails?.expected?.shift_end_time).format("hh:mm A")}
                </p>
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
                <p>{basicDetails?.facility?.conditional_rates?.overtime?.rate}</p>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CancelledShiftsViewScreen;
