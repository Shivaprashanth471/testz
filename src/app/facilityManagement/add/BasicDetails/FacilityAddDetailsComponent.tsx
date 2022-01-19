import React from 'react';
import { Box, MenuItem } from "@material-ui/core";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { facilityFormValidation, facilityInitialState } from '../FacilityInitialAndValidationsComponent';
import { ScrollToError } from '../../../../components/ScrollToError';
import PhoneInputComponent from '../../../../components/phoneInput/PhoneInputComponent';
import { PdfIcon } from '../../../../constants/ImageConfig';
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';

export interface FacilityAddDetailsComponentProps {
    onAdd: any;
    regions: any;
    americanTimeZone: any;
    fileUpload: any;
    previewFile: any;
    deleteFile: any;
    OnFileSelected: any;
    otHours: any
}

const FacilityAddDetailsComponent = (props: any) => {
    const onAdd = props?.onAdd;
    const regions = props?.regions;
    const americanTimeZone = props?.americanTimeZone;
    const fileUpload = props?.fileUpload;
    const previewFile = props?.previewFile;
    const deleteFile = props?.deleteFile;
    const OnFileSelected = props?.OnFileSelected;
    const otHours = props?.otHours;

    const showDropDownBelowField = {
        MenuProps: {
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
            },
            getContentAnchorEl: null
        }
    }

    return <div>
        <Formik
            initialValues={facilityInitialState}
            validateOnChange={true}
            validationSchema={facilityFormValidation}
            onSubmit={onAdd}>
            {({ isSubmitting, isValid, resetForm }) => (
                <Form id="facility-add-form" className={"form-holder"}>
                    <ScrollToError />
                    <div className="facility-basic-details custom-border">
                        <p className='card-header'>Basic Details</p>
                        <div className="input-container">
                            <Field variant="outlined" name="facility_name" type={"text"} component={TextField}
                                label="Facility Name*" fullWidth autoComplete="off" id='input_facility_add_facility_name' />
                            <Field variant="outlined" name="business_name" type={"text"} component={TextField}
                                label="Business Name" fullWidth autoComplete="off" id='input_facility_add_business_name' />
                        </div>

                        <div className="input-container">
                            <Field variant="outlined" name="facility_uid" type={"text"} component={TextField}
                                label="Facility Unique ID*" fullWidth autoComplete="off" id='input_facility_add_facility_uid' />
                            <Field variant="outlined" name="facility_short_name" type={"text"} component={TextField}
                                label="Facility Short Name*" fullWidth autoComplete="off" id='input_facility_add_facility_short_name' />
                        </div>

                        <div className="input-container ">
                            <Field SelectProps={showDropDownBelowField} variant="outlined" name="address.region_name" type={"text"}
                                component={TextField} select label="Region*" fullWidth className="flex-1" autoComplete="off"
                                id='input_facility_add_address_region_name'>
                                {regions &&
                                    regions.map((item: any, index: any) => (
                                        <MenuItem id={`${item}`} value={item.code} key={index}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                            </Field>

                            <div className="flex-1 d-flex" >
                                <div className="phone-number">
                                    <Field name={'phone_number'} variant="outlined" inputProps={{ maxLength: 10 }} id='phone_num' style={{ font: "inherit" }}>
                                        {(field: FieldProps) => {
                                            return <PhoneInputComponent field={field} placeholder={'Enter Phone number*'} />
                                        }}
                                    </Field>
                                </div>

                                <div className="extension-number" >
                                    <Field inputProps={{ maxLength: 10 }} variant='outlined' component={TextField} fullWidth autoComplete="off"
                                        label="Extension No" name="extension_number" id="input_facility_add_extension_number" />
                                </div>
                            </div>

                        </div>
                        <div className="input-container">
                            <Field variant="outlined" name="email" type={"text"} component={TextField}
                                label="Email" fullWidth autoComplete="off" id='input_facility_add_email' />
                            <Field variant="outlined" name="website_url" type={"text"} component={TextField}
                                label="Website" fullWidth autoComplete="off" id='input_facility_add_website_url' />
                        </div>

                        <div className="input-container ">
                            <Field variant="outlined" name="address.street" type={"text"} component={TextField}
                                label="Street*" fullWidth autoComplete="off" id='input_facility_add_address_street' />
                            <Field variant="outlined" name="address.city" type={"text"} component={TextField}
                                label="City*" fullWidth autoComplete="off" id='input_facility_add_address_city' />
                        </div>

                        <div className="input-container">
                            <Field variant="outlined" name="address.state" type={"text"} component={TextField}
                                label="State*" fullWidth autoComplete="off" id='input_facility_add_address_state' />
                            <Field variant="outlined" name="address.country" type={"text"} component={TextField}
                                label="Country*" fullWidth autoComplete="off" id='input_facility_add_address_country' />
                        </div>
                        <div className="input-container ">
                            <Field input
                                inputProps={{
                                    maxLength: 6
                                }}
                                variant="outlined" name="address.zip_code" type={"text"} component={TextField}
                                label="Zip Code*" autoComplete="off" id='input_facility_add_address_zip_code' />
                            <Field SelectProps={showDropDownBelowField} variant="outlined" name="timezone" type={"text"}
                                component={TextField} select label="Facility Timezone*" fullWidth
                                autoComplete="off" id='input_facility_add_timezone'>
                                <MenuItem style={{ fontWeight: 500 }} value="">Select Timezone</MenuItem>
                                {americanTimeZone &&
                                    americanTimeZone.map((item: any, index: any) => (
                                        <MenuItem style={{ fontSize: '14px' }} value={item.value} key={index}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                            </Field>
                        </div>

                        <div className="input-container">
                            <Field fullWidth variant="outlined" name="latitude" type={"text"} component={TextField}
                                label="Latitude*" autoComplete="off" id='input_facility_add_latitude' />
                            <Field fullWidth variant="outlined" name="longitude" type={"text"} component={TextField}
                                label="Longitude*" autoComplete="off" id='input_facility_add_longitude' />
                        </div>
                        <div className="facility-about ">
                            <p className='card-header'>
                                About the Facility
                            </p>
                            <Field variant="outlined" component={TextField} type={"text"} name="about"
                                fullWidth multiline rows={2} id='input_facility_add_about' />
                        </div>
                        <h3 className="card-header facility-image-header mrg-bottom-0">Upload Facility Image</h3>
                        <div className="d-flex mrg-top-10" style={{ gap: "50px" }}>
                            {
                                fileUpload?.wrapper && fileUpload?.wrapper?.map((item: any, index: any) => {
                                    return (
                                        <div className="attachments">
                                            {item?.file?.type === "image/jpg" || item?.file?.type === "image/png" || item?.file?.type === "image/jpeg" ? <img src={item?.file?.base64} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} /> : <img src={PdfIcon} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} />}
                                            <div className="d-flex image_actions mrg-top-10">
                                                <p style={{ cursor: 'pointer' }} onClick={() => previewFile(index)} className="delete-image">View</p>
                                                <p style={{ cursor: 'pointer' }} onClick={() => deleteFile(index)} className="delete-image mrg-left-20">Delete</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {fileUpload?.wrapper.length >= 1 ? (
                            <></>
                        ) : (
                            <div>
                                <Box display="flex" gridGap="10px">
                                    <Box width="250px" className="mrg-top-10">
                                        <FileDropZoneComponent OnFileSelected={OnFileSelected} allowedTypes={".jpg,.png,.jpeg"} />
                                    </Box>
                                </Box>
                            </div>
                        )}
                    </div>
                    <div className="facility-other-details mrg-top-10 custom-border">
                        <p className='card-header'>Other Details</p>

                        <div className="input-container ">
                            <Field variant="outlined" name="hourly_base_rates.cna" type={"text"} component={TextField}
                                label="CNA Rate ($/hr)*" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_cna' />
                            <Field variant="outlined" name="hourly_base_rates.lvn" type={"text"} component={TextField}
                                label="LVN Rate ($/hr)*" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_lvn' />
                        </div>

                        <div className="input-container">
                            <Field variant="outlined" name="hourly_base_rates.rn" type={"text"} component={TextField}
                                label="RN Rate ($/hr)*" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_rn' />
                            <Field variant="outlined" name="hourly_base_rates.care_giver" type={"text"} component={TextField}
                                label="Care Giver (hr)*" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_care_giver' />
                        </div>

                        <div className="input-container ">
                            <Field variant="outlined" name="hourly_base_rates.med_tech" type={"text"} component={TextField}
                                label="Med Tech (hr)*" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_med_tech' />
                            <Field variant="outlined" name="hourly_base_rates.holiday" type={"text"} component={TextField}
                                label="Holiday Rate ($)" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_holiday' />
                        </div>
                        <div className="input-container">
                            <Field variant="outlined" name="diff_rates.noc" type={"text"} component={TextField}
                                label="NOC Diff ($)*" fullWidth autoComplete="off" id='input_facility_add_diff_rates_noc' />
                            <Field variant="outlined" name="hourly_base_rates.hazard" type={"text"} component={TextField}
                                label="Hazard Rate ($)" fullWidth autoComplete="off" id='input_facility_add_hourly_base_rates_hazard' />
                        </div>

                        <div className="input-container ">
                            <Field variant="outlined" name="diff_rates.pm" type={"text"} component={TextField}
                                label="PM Diff ($)*" fullWidth autoComplete="off" id='input_facility_add_diff_rates_pm' />
                            <Field variant="outlined" name="diff_rates.weekend" type={"text"} component={TextField}
                                label="Weekend Rate ($)*" fullWidth autoComplete="off" id='input_facility_add_diff_rates_weekend' />
                        </div>

                        <div className='input-container'>
                            <Field SelectProps={showDropDownBelowField} variant="outlined" name="conditional_rates.overtime.hours" type={"text"} component={TextField}
                                select label="OT Hours (hr/day)" fullWidth autoComplete="off" id='input_facility_add_conditional_rates.overtime.hours'>
                                <MenuItem>Select</MenuItem>
                                {otHours &&
                                    otHours.map((item: any, index: any) => (
                                        <MenuItem value={item.value} key={index}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                            </Field>
                            <Field variant="outlined" name="conditional_rates.overtime.rate" type={"text"} component={TextField}
                                label="OT Rate($)" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_overtime_rate' />
                        </div>

                        <div className="input-container mrg-top-10">
                            <Field variant="outlined" name="conditional_rates.rush.hours" type={"text"} component={TextField}
                                label="Rush Hours" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_rush_hours' />
                            <Field variant="outlined" name="conditional_rates.rush.rate" type={"text"} component={TextField}
                                label="Rush Rate($)" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_rush_rate' />

                        </div>

                        <div className="input-container">
                            <Field variant="outlined" name="conditional_rates.cancellation_before.hours" type={"text"} component={TextField}
                                label="Cancellation Before Hours" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_cancellation_before_hours' />
                            <Field variant="outlined" name="conditional_rates.cancellation_before.rate" type={"text"} component={TextField}
                                label="Cancellation Before Rate(Hrs)" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_cancellation_before_rate' />
                        </div>

                        <div className="input-container mrg-top-10">
                            <Field variant="outlined" name="conditional_rates.shift_early_completion.hours" type={"text"} component={TextField}
                                label="Shift Early Completion Hours" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_shift_early_completion_hours' />
                            <Field variant="outlined" name="conditional_rates.shift_early_completion.rate" type={"text"} component={TextField}
                                label="Shift Early Completion Rate(Hrs)" fullWidth autoComplete="off" id='input_facility_add_conditional_rates_shift_early_completion_rate' />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    </div>;
}

export default FacilityAddDetailsComponent;