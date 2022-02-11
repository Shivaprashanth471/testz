import React, { useCallback, useEffect, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import NoDataToShowCardComponent from "../../../../components/NoDataToShowCardComponent";
import CustomPreviewFile from "../../../../components/shared/CustomPreviewFile";
import { americanTimeZone } from "../../../../constants/data";
import { Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { Link, useParams } from "react-router-dom";

const FacilityBasicDetailsComponent = (props: any) => {
  const facilityDetails = props?.facilityDetails;
  const [timeZone, setTimeZone] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const previewFile = useCallback((index: any) => {
    setOpen(true);
  }, []);

  const cancelPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);
  const confirmPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    for (let i = 0; i < americanTimeZone?.length; i++) {
      if (americanTimeZone[i]?.value === facilityDetails?.timezone) {
        setTimeZone(americanTimeZone[i]?.label);
      }
    }
  }, [facilityDetails]);

  return (
    <>
      <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
        <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={facilityDetails?.image_url} />
      </DialogComponent>
      <div className="fac-edit-btn">
        <div>
          <Tooltip title={`Edit ${facilityDetails?.facility_name}`}>
            <Button variant={"contained"} color={"primary"} component={Link} to={`/facility/edit/` + id}>
              Edit Facility
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="custom-border">
        <div className="basic_details">
          <div className="d-flex title-rating-container edit-facility-wrapper">
            <h3>Basic Details</h3>
            <div className='rating-container'>
              <p className='rating-title'>Average Rating</p>
              <p className='rating-content'>{facilityDetails?.rating ? `${facilityDetails?.rating}/5` : "N/A"}</p>
            </div>
          </div>
          <div className="d-flex ">
            <div className="flex-1 ">
              <h4>Facility Name</h4>
              <p>{facilityDetails?.facility_name}</p>
            </div>
            <div className="flex-1">
              <h4>Business Name</h4>
              <p>{facilityDetails?.business_name}</p>
            </div>
            <div className="flex-1">
              <h4>Facility Unique Id</h4>
              <p>{facilityDetails?.facility_uid}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Facility Short Name</h4>
              <p>{facilityDetails?.facility_short_name}</p>
            </div>
            <div className="flex-1">
              <h4>Region Name</h4>
              <p>{facilityDetails?.address?.region_name}</p>
            </div>
            <div className="flex-1">
              <h4>Email</h4>
              <p>{facilityDetails?.email}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Contact Number</h4>
              <p>{facilityDetails?.phone_number}</p>
            </div>
            <div className="flex-1">
              <h4>Extension Number</h4>
              <p>{facilityDetails?.extension_number ? facilityDetails?.extension_number : "N/A"}</p>
            </div>
            <div className="flex-1">
              <h4>Website</h4>
              <p>{facilityDetails?.website_url}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Street</h4>
              <p>{facilityDetails?.address?.street}</p>
            </div>
            <div className="flex-1">
              <h4>City</h4>
              <p>{facilityDetails?.address?.city}</p>
            </div>
            <div className="flex-1">
              <h4>State</h4>
              <p>{facilityDetails?.address?.state}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Country</h4>
              <p>{facilityDetails?.address?.country}</p>
            </div>
            <div className="flex-1">
              <h4>Zipcode</h4>
              <p>{facilityDetails?.address?.zip_code}</p>
            </div>
            <div className="flex-1">
              <h4>TimeZone</h4>
              <p>{timeZone}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Latitude</h4>
              <p>{facilityDetails?.location?.coordinates?.[1]}</p>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <h4>Longitude</h4>
              <p>{facilityDetails?.location?.coordinates?.[0]}</p>
            </div>
          </div>
          <div>
            <h4>About</h4>
            <p className="summary">{facilityDetails?.about}</p>
          </div>
        </div>
      </div>
      <div className="custom-border mrg-top-10 pdd-top-10">
        <h3 className="card-header">Facility Image</h3>
        <div className="d-flex" style={{ gap: "50px" }}>
          {facilityDetails?.image_url ? (
            <div className="attachments" onClick={previewFile} style={{ cursor: "pointer" }}>
              <Tooltip title="Preview Facility Icon">
                <img src={facilityDetails?.image_url} alt="" style={{ height: "100px", width: "100px" }} />
              </Tooltip>
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <NoDataToShowCardComponent />
            </div>
          )}
        </div>
      </div>
      <div className="basic_details custom-border mrg-top-10">
        <h3>Other Details</h3>
        <div className="d-flex">
          <div className="flex-1">
            <h4>CNA Rate ($ / hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.cna}</p>
          </div>
          <div className="flex-1">
            <h4>LVN Rate ($ / hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.lvn}</p>
          </div>
          <div className="flex-1">
            <h4>RN Rate ($ / hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.rn}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <h4>Care Giver (Hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.care_giver}</p>
          </div>
          <div className="flex-1">
            <h4>Med Tech (Hr)</h4>
            <p>{facilityDetails?.hourly_base_rates.med_tech}</p>
          </div>
          <div className="flex-1">
            <h4>Holiday Rate (Hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.holiday}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <h4>NOC Diff</h4>
            <p>{facilityDetails?.diff_rates?.noc}</p>
          </div>
          <div className="flex-1">
            <h4>Hazard Rate ($ / hr)</h4>
            <p>{facilityDetails?.hourly_base_rates?.hazard}</p>
          </div>
          <div className="flex-1">
            <h4>PM Diff ($ / hr)</h4>
            <p>{facilityDetails?.diff_rates?.pm}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <h4>Weekend Rate ($ / hr)</h4>
            <p>{facilityDetails?.diff_rates?.weekend}</p>
          </div>
          <div className="flex-1">
            <h4>OT Hours</h4>
            <p>{facilityDetails?.conditional_rates?.overtime?.hours}</p>
          </div>
          <div className="flex-1">
            <h4>OT Rate ($ / hr)</h4>
            <p>{facilityDetails?.conditional_rates?.overtime?.rate}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <h4>Rush Hours</h4>
            <p>{facilityDetails?.conditional_rates?.rush?.hours}</p>
          </div>
          <div className="flex-1">
            <h4>Rush Rate ($ / hr)</h4>
            <p>{facilityDetails?.conditional_rates?.rush?.rate}</p>
          </div>
          <div className="flex-1">
            <h4>Cancellation Before Hours</h4>
            <p>{facilityDetails?.conditional_rates?.cancellation_before?.hours}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <h4>Cancellation Before Rate (Hrs)</h4>
            <p>{facilityDetails?.conditional_rates?.cancellation_before?.rate}</p>
          </div>
          <div className="flex-1">
            <h4>Shift Early Completion Hours</h4>
            <p>{facilityDetails?.conditional_rates?.shift_early_completion?.hours}</p>
          </div>
          <div className="flex-1">
            <h4>Shift Early Completion Rate (Hrs)</h4>
            <p>{facilityDetails?.conditional_rates?.shift_early_completion?.rate}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacilityBasicDetailsComponent;
