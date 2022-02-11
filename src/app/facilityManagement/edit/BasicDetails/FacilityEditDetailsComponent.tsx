import React from "react";
import { americanTimeZone, otHours } from "../../../../constants/data";
import { PdfIcon } from "../../../../constants/ImageConfig";
import { TextField } from "formik-material-ui";
import PhoneInputComponent from "../../../../components/phoneInput/PhoneInputComponent";
import FileDropZoneComponent from "../../../../components/core/FileDropZoneComponent";
import { facilityFormEditValidation, FacilityItemEditType } from "../FacilityInitialAndValidationsComponent";
import { Box, MenuItem, Tooltip, Typography } from "@material-ui/core";
import { Field, Form, Formik, FieldProps } from "formik";
import { ScrollToError } from "../../../../components/ScrollToError";

export interface FacilityEditDetailsComponentProps {
  onAdd: any;
  regions: any;
  isImageRemoved: any;
  facilityDetails: any;
  deleteFacilityImage: any;
  fileUpload: any;
  previewFile: any;
  deleteFile: any;
  OnFileSelected: any;
}

const FacilityEditDetailsComponent = (props: FacilityEditDetailsComponentProps) => {
  const onAdd = props?.onAdd;
  const regions = props?.regions;
  const isImageRemoved = props?.isImageRemoved;
  const facilityDetails = props?.facilityDetails;
  const deleteFacilityImage = props?.deleteFacilityImage;
  const previewFile = props?.previewFile;
  const fileUpload = props?.fileUpload;
  const onFileSelected = props?.OnFileSelected;
  const deleteFile = props?.deleteFile;

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      getContentAnchorEl: null,
    },
  };

  const facilityInitialState: FacilityItemEditType = {
    facility_uid: facilityDetails?.facility_uid,
    facility_name: facilityDetails?.facility_name,
    facility_short_name: facilityDetails?.facility_short_name,
    business_name: facilityDetails?.business_name,
    email: facilityDetails?.email,
    phone_number: facilityDetails?.phone_number,
    extension_number: facilityDetails?.extension_number,
    website_url: facilityDetails?.website_url,
    about: facilityDetails?.about,
    address: {
      street: facilityDetails?.address?.street,
      city: facilityDetails?.address?.city,
      state: facilityDetails?.address?.state,
      region_name: facilityDetails?.address?.region_name,
      country: facilityDetails?.address?.country,
      zip_code: facilityDetails?.address?.zip_code,
    },
    timezone: facilityDetails?.timezone,
    hourly_base_rates: {
      cna: facilityDetails?.hourly_base_rates?.cna,
      lvn: facilityDetails?.hourly_base_rates?.lvn,
      rn: facilityDetails?.hourly_base_rates?.rn,
      care_giver: facilityDetails?.hourly_base_rates?.care_giver,
      med_tech: facilityDetails?.hourly_base_rates?.med_tech,
      holiday: facilityDetails?.hourly_base_rates?.holiday,
      hazard: facilityDetails?.hourly_base_rates?.hazard,
    },
    diff_rates: {
      pm: facilityDetails?.diff_rates?.pm,
      noc: facilityDetails?.diff_rates?.noc,
      weekend: facilityDetails?.diff_rates?.weekend,
    },
    conditional_rates: {
      overtime: {
        hours: facilityDetails?.conditional_rates?.overtime?.hours,
        rate: facilityDetails?.conditional_rates?.overtime?.rate,
      },
      rush: {
        hours: facilityDetails?.conditional_rates?.rush?.hours,
        rate: facilityDetails?.conditional_rates?.rush?.rate,
      },
      cancellation_before: {
        hours: facilityDetails?.conditional_rates?.cancellation_before?.hours,
        rate: facilityDetails?.conditional_rates?.cancellation_before?.rate,
      },
      shift_early_completion: {
        hours: facilityDetails?.conditional_rates?.shift_early_completion?.hours,
        rate: facilityDetails?.conditional_rates?.shift_early_completion?.rate,
      },
    },

    location: {
      coordinates: {
        longitude: facilityDetails?.location?.coordinates?.[0],
        latitude: facilityDetails?.location?.coordinates?.[1],
      },
    },
  };

  return (
    <div>
      <Formik initialValues={facilityInitialState} validateOnChange={true} validationSchema={facilityFormEditValidation} onSubmit={onAdd}>
        {({ isSubmitting, isValid, resetForm }) => (
          <Form id="facility-edit-form" className={"form-holder"}>
            <ScrollToError />
            <div className="facility-basic-details mrg-top-40 custom-border">
              <p className="card-header">Basic Details</p>
              <div className="input-container">
                <Field variant="outlined" name="facility_name" type={"text"} component={TextField} label="Facility Name*" fullWidth autoComplete="off" id="input_facility_edit_facility_name" />
                <Field variant="outlined" name="business_name" type={"text"} component={TextField} label="Business Name" fullWidth autoComplete="off" id="input_facility_edit_business_name" />
              </div>

              <div className="input-container">
                <Field variant="outlined" name="facility_uid" type={"text"} component={TextField} label="Facility Unique ID*" fullWidth autoComplete="off" id="input_facility_edit_facility_uid" />
                <Field variant="outlined" name="facility_short_name" type={"text"} component={TextField} label="Facility Short Name*" fullWidth autoComplete="off" id="input_facility_edit_facility_short_name" />
              </div>
              <div className="input-container mrg-top-10">
                <Field
                  SelectProps={showDropDownBelowField}
                  variant="outlined"
                  name="address.region_name"
                  type={"text"}
                  component={TextField}
                  select
                  label="Region*"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_address_region_name"
                  className="flex-1"
                >
                  {regions &&
                    regions.map((item: any, index: any) => (
                      <MenuItem value={item.name} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Field>
                <div className="flex-1 d-flex">
                  <div className="phone-number">
                    <Field name={"phone_number"} className="flex-1">
                      {(field: FieldProps) => {
                        return <PhoneInputComponent field={field} placeholder={"Enter Phone number*"} />;
                      }}
                    </Field>
                  </div>
                  <div className="extension-number">
                    <Field inputProps={{ maxLength: 10 }} variant="outlined" component={TextField} fullWidth autoComplete="off" label="Extension No." name="extension_number" id="input_facility_add_extension_number" />
                  </div>
                </div>
              </div>
              <div className="input-container">
                <Field variant="outlined" name="email" type={"text"} component={TextField} label="Email" fullWidth autoComplete="off" id="input_facility_edit_email" />
                <Field variant="outlined" name="website_url" type={"text"} component={TextField} label="Website" fullWidth autoComplete="off" id="input_facility_edit_website_url" />
              </div>

              <div className="input-container mrg-top-10">
                <Field variant="outlined" name="address.street" type={"text"} component={TextField} label="Street*" fullWidth autoComplete="off" id="input_facility_edit_address_street" />
                <Field variant="outlined" name="address.city" type={"text"} component={TextField} label="City*" fullWidth autoComplete="off" id="input_facility_edit_address_city" />
              </div>

              <div className="input-container">
                <Field variant="outlined" name="address.state" type={"text"} component={TextField} label="State*" fullWidth autoComplete="off" id="input_facility_edit_address_state" />
                <Field variant="outlined" name="address.country" type={"text"} component={TextField} label="Country*" fullWidth autoComplete="off" id="input_facility_edit_address_country" />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  inputProps={{
                    maxLength: 6,
                  }}
                  variant="outlined"
                  name="address.zip_code"
                  type={"text"}
                  component={TextField}
                  label="Zip Code*"
                  autoComplete="off"
                  id="input_facility_edit_address_zip_code"
                />
                <Field
                  fontSize="small"
                  className="timezone-select"
                  variant="outlined"
                  name="timezone"
                  type={"text"}
                  component={TextField}
                  select
                  SelectProps={showDropDownBelowField}
                  label="Facility Timezone*"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_timezone"
                >
                  <MenuItem style={{ fontWeight: 500 }} value="">
                    {" "}
                    Select Timezone
                  </MenuItem>
                  {americanTimeZone &&
                    americanTimeZone.map((item: any, index: any) => (
                      <MenuItem style={{ fontSize: "14px" }} value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Field>
              </div>

              <div className="input-container">
                <Field fullWidth variant="outlined" name="location.coordinates.latitude" type={"text"} component={TextField} label="Latitude*" autoComplete="off" id="input_facility_add_latitude" />
                <Field fullWidth variant="outlined" name="location.coordinates.longitude" type={"text"} component={TextField} label="Longitude*" autoComplete="off" id="input_facility_add_longitude" />
              </div>
              <div className="facility-about mrg-top-10">
                <Typography color="textPrimary">About the Facility</Typography>
                <Field variant="outlined" component={TextField} type={"text"} name="about" fullWidth multiline rows={2} id="input_facility_edit_about" />
              </div>
            </div>
            <div className="facility-other-details mrg-top-10  custom-border">
              <p className="card-header">Other Details</p>
              <div className="input-container ">
                <Field variant="outlined" name="hourly_base_rates.cna" type={"text"} component={TextField} label="CNA Rate ($/hr)*" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_cna" />
                <Field variant="outlined" name="hourly_base_rates.lvn" type={"text"} component={TextField} label="LVN Rate ($/hr)*" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_lvn" />
              </div>
              <div className="input-container">
                <Field variant="outlined" name="hourly_base_rates.rn" type={"text"} component={TextField} label="RN Rate ($/hr)*" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_rn" />
                <Field variant="outlined" name="hourly_base_rates.care_giver" type={"text"} component={TextField} label="Care Giver (hr)" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_care_giver" />
              </div>
              <div className="input-container ">
                <Field variant="outlined" name="hourly_base_rates.med_tech" type={"text"} component={TextField} label="Med Tech (hr)" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_med_tech" />
                <Field variant="outlined" name="hourly_base_rates.holiday" type={"text"} component={TextField} label="Holiday Rate ($)*" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_holiday" />
              </div>
              <div className="input-container">
                <Field variant="outlined" name="diff_rates.noc" type={"text"} component={TextField} label="NOC Diff ($)*" fullWidth autoComplete="off" id="input_facility_edit_diff_rates_noc" />
                <Field variant="outlined" name="hourly_base_rates.hazard" type={"text"} component={TextField} label="Hazard Rate ($)*" fullWidth autoComplete="off" id="input_facility_edit_hourly_base_rates_hazard" />
              </div>
              <div className="input-container ">
                <Field variant="outlined" name="diff_rates.pm" type={"text"} component={TextField} label="PM Diff ($)*" fullWidth autoComplete="off" id="input_facility_edit_diff_rates_pm" />
                <Field variant="outlined" name="diff_rates.weekend" type={"text"} component={TextField} label="Weekend Rate ($)*" fullWidth autoComplete="off" id="input_facility_edit_diff_rates_weekend" />
              </div>
              <div className="input-container">
                <Field
                  SelectProps={showDropDownBelowField}
                  variant="outlined"
                  name="conditional_rates.overtime.hours"
                  type={"text"}
                  component={TextField}
                  select
                  label="OT Hours (hr/day)"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_conditional_rates.overtime.hours"
                >
                  <MenuItem>Select</MenuItem>
                  {otHours && otHours.map((item: any, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Field>
                <Field variant="outlined" name="conditional_rates.overtime.rate" type={"text"} component={TextField} label="OT Rate($)" fullWidth autoComplete="off" id="input_facility_edit_conditional_rates_overtime_rate" />
              </div>

              <div className="input-container mrg-top-10">
                <Field variant="outlined" name="conditional_rates.rush.hours" type={"text"} component={TextField} label="Rush Hours" fullWidth autoComplete="off" id="input_facility_edit_conditional_rates_rush_hours" />
                <Field variant="outlined" name="conditional_rates.rush.rate" type={"text"} component={TextField} label="Rush Rate($)" fullWidth autoComplete="off" id="input_facility_edit_conditional_rates_rush_rate" />
              </div>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="conditional_rates.cancellation_before.hours"
                  type={"text"}
                  component={TextField}
                  label="Cancellation Before Hours"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_conditional_rates_cancellation_before_hours"
                />
                <Field
                  variant="outlined"
                  name="conditional_rates.cancellation_before.rate"
                  type={"text"}
                  component={TextField}
                  label="Cancellation Before Rate(Hrs)"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_conditional_rates_cancellation_before_rate"
                />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  variant="outlined"
                  name="conditional_rates.shift_early_completion.hours"
                  type={"text"}
                  component={TextField}
                  label="Shift Early Completion Hours"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_conditional_rates_shift_early_completion_hours"
                />
                <Field
                  variant="outlined"
                  name="conditional_rates.shift_early_completion.rate"
                  type={"text"}
                  component={TextField}
                  label="Shift Early Completion Rate(Hrs)"
                  fullWidth
                  autoComplete="off"
                  id="input_facility_edit_conditional_rates_shift_early_completion_rate"
                />
              </div>
              <p className="card-header facility-image-header">Facility Image</p>
              {facilityDetails?.image_url && !isImageRemoved ? (
                <div className="attachments">
                  <div className="custom_file">
                    <div className="d-flex">
                      <div className="mrg-left-0 mrg-top-10">
                        <img src={facilityDetails?.image_url} alt="" style={{ height: "100px", width: "100px" }} />{" "}
                      </div>
                      <div className="file_details mrg-left-20"></div>
                    </div>
                    <div className="facility_image_actions mrg-left-5 mrg-top-10 ">
                      <p style={{ cursor: "pointer", width: "50px" }} onClick={deleteFacilityImage}>
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {fileUpload?.wrapper.length > 0 ? (
                    fileUpload?.wrapper?.map((item: any, index: any) => {
                      return (
                        <div className="attachments">
                          <div className="custom_file">
                            <div className="d-flex">
                              <div className="mrg-left-0 mrg-top-10">
                                {" "}
                                <Tooltip title="Preview Facility Icon">
                                  {item?.file?.type === "image/jpg" || item?.file?.type === "image/png" || item?.file?.type === "image/jpeg" ? (
                                    <img src={item?.file?.base64} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} />
                                  ) : (
                                    <img src={PdfIcon} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} />
                                  )}
                                </Tooltip>
                              </div>
                              <div className="file_details mrg-left-20"></div>
                            </div>
                            <div className="d-flex image_actions mrg-top-10">
                              <p style={{ cursor: "pointer" }} onClick={() => previewFile(index)} className="delete-image">
                                View
                              </p>
                              <p style={{ cursor: "pointer" }} onClick={() => deleteFile(index)} className="delete-image mrg-left-20">
                                Delete
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <Box display="flex" gridGap="10px">
                      <Tooltip title={"Upload Facility Image"}>
                        <Box width="250px" className="mrg-top-10">
                          <FileDropZoneComponent allowedTypes={".jpg,.png,jpeg"} OnFileSelected={onFileSelected} />
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FacilityEditDetailsComponent;
