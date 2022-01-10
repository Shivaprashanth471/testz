import React, { PropsWithChildren } from "react";
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';
import PhoneInputComponent from "../../../../components/phoneInput/PhoneInputComponent";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker, DateTimePicker } from "formik-material-ui-pickers";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { boolAcknowledge, contactType, covidPreference, genderTypes, gustoType, moreImportant, shiftTypePreference, vaccine } from "../../../../constants/data";
import { Box, MenuItem } from "@material-ui/core";
import { hcpFormValidation } from '../../add/AddHcpValuesValidationsComponent';
import { ScrollToError } from '../../../../components/ScrollToError';
import HcpEditAttachmentsComponent from '../EditAttachments/HcpEditAttachmentsComponent';

export interface EditHcpBasicDetailsComponentProps {
    contractFile: any;
    fileUpload: any;
    onAdd: any;
    hcpTypes: any;
    regions: any;
    specialities: any;
    expInYears: any;
    required_attachments: any;
    deleteAttachment: any;
    OnContractFileUpload: any;
    deleteContractFile: any;
    isDeleted: any;
    OnFileSelected: any;
    attachmentsDetails: any;
    isContractDeleted: any;
    deleteContractFileApi: any;
    previewFile: any;
    contractDetails: any;
    handleExpiryDate: any;
    deleteLocalAttachment: any;
    hcpInitialState: any
}

const EditHcpBasicDetailsComponent = (props: PropsWithChildren<EditHcpBasicDetailsComponentProps>) => {
    const hcpInitialState = props?.hcpInitialState
    const contractFile = props?.contractFile;
    const fileUpload = props?.fileUpload;
    const onAdd = props?.onAdd;
    const hcpTypes = props?.hcpTypes;
    const regions = props?.regions;
    const specialities = props?.specialities;
    const expInYears = props?.expInYears;
    const required_attachments = props?.required_attachments;
    const deleteAttachment = props?.deleteAttachment;
    const OnContractFileUpload = props?.OnContractFileUpload;
    const deleteContractFile = props?.deleteContractFile;
    const isDeleted = props?.isDeleted;
    const OnFileSelected = props?.OnFileSelected;
    const attachmentsDetails = props?.attachmentsDetails;
    const isContractDeleted = props?.isContractDeleted;
    const deleteContractFileApi = props?.deleteContractFileApi;
    const previewFile = props?.previewFile;
    const contractDetails = props?.contractDetails;
    const handleExpiryDate = props?.handleExpiryDate;
    const deleteLocalAttachment = props?.deleteLocalAttachment;

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
            initialValues={hcpInitialState}
            validateOnChange={true}
            validationSchema={hcpFormValidation}
            onSubmit={onAdd}
        >
            {({ isSubmitting, isValid, resetForm, setFieldValue }) => (
                <Form id="hcp-edit-form" className={"form-holder"}>
                    <ScrollToError />
                    <div className="hcp-basic-details">
                        <div className="custom-border">
                            <p className='card-header'>Basic Details</p>
                            <div className="input-container">
                                <Field variant='outlined' name="first_name" type={"text"} component={TextField}
                                    label="First Name" fullWidth id="input_hcp_edit_first_name" autoComplete="off" />
                                <Field variant='outlined' name="last_name" type={"text"} component={TextField}
                                    label="Last Name" fullWidth id="input_hcp_edit_last_name" autoComplete="off" />
                            </div>

                            <div className="input-container">
                                <Field variant='outlined' component={TextField} type={"text"} fullWidth autoComplete="off"
                                    label="Email" name="email" id="input_hcp_edit_email" className="flex-1" />
                                <div className="flex-1">
                                    <Field
                                        name={'contact_number'} className="flex-1">
                                        {(field: FieldProps) => {
                                            return <PhoneInputComponent field={field} placeholder={'Enter Phone number'} />
                                        }}
                                    </Field>
                                </div>
                            </div>
                            <div className="input-container">
                                <Field SelectProps={showDropDownBelowField} variant='outlined'
                                    onChange={(e: any) => {
                                        const hcpType = e.target.value;
                                        setFieldValue("hcp_type", hcpType);
                                    }}
                                    component={TextField} type={"text"} select label="HCP Type" name="hcp_type"
                                    id="menu_hcp_edit_hcp_type" fullWidth autoComplete="off">

                                    {hcpTypes.map((item: any, index: number) => (
                                        <MenuItem value={item.code} key={index} id={"menu_hcp_edit_hcp_type" + item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Field>

                                <Field SelectProps={showDropDownBelowField} variant='outlined' component={TextField} type={"text"} select
                                    label="Gender" name="gender" id="menu_hcp_edit_gender" fullWidth autoComplete="off">
                                    {genderTypes.map((item: any, index: any) => (
                                        <MenuItem value={item.value} key={index} id={"menu_hcp_edit_gender_" + item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </div>

                            <div className="input-container">
                                <Field variant='outlined' name="address.street" type={"text"} component={TextField}
                                    label="Street" id="input_hcp_edit_street" fullWidth autoComplete="off" />
                                <Field variant='outlined' name="address.city" type={"text"} id="input_hcp_edit_city"
                                    component={TextField} label="City" fullWidth autoComplete="off" />
                            </div>
                            <div className="input-container">
                                <Field SelectProps={showDropDownBelowField} variant='outlined' component={TextField} type={"text"} select
                                    label="Region" name="address.region" id="menu_hcp_edit_region" fullWidth autoComplete="off">
                                    {regions &&
                                        regions.map((item: any, index: any) => (
                                            <MenuItem value={item.name} key={index} id={"menu_hcp_edit_region" + item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                </Field>

                                <Field variant='outlined' name="address.state" type={"text"} component={TextField}
                                    label="State" id="input_hcp_edit_state" fullWidth autoComplete="off" />
                            </div>
                            <div className="input-container ">
                                <Field
                                    inputProps={{
                                        maxLength: 6
                                    }}
                                    variant='outlined' fullWidth name="address.zip_code" type={"text"} component={TextField}
                                    label="Zip" id="input_hcp_edit_zip" autoComplete="off" />
                                <Field variant='outlined' name="address.country" type={"text"} component={TextField}
                                    label="Country" fullWidth id="input_hcp_edit_country" autoComplete="off" />
                            </div>

                            <div className="facility-about mrg-top-10">
                                <p className='card-header'>About the HCP</p>
                                <Field variant='outlined' component={TextField} type={"text"} fullWidth
                                    autoComplete="off" id="input_hcp_edit_about" name="about" multiline rows={2} />
                            </div>
                        </div>

                        <div className="hcp-profession-details  mrg-top-10 custom-border">
                            <p className='card-header'>Professional Details (Based On Work Experience)</p>
                            <div className="input-container">
                                <Field value={expInYears} disabled variant='outlined' component={TextField} label="Years of Experience"
                                    name="professional_details.experience" id="input_hcp_edit_proffesional_details" fullWidth autoComplete="off" />
                            </div>
                            <div className="input-container ">
                                <Field value={specialities} disabled variant='outlined' component={TextField} type={"text"} label="Specialities"
                                    id="input_hcp_edit_speciality" name="professional_details.speciality" fullWidth autoComplete="off" />
                            </div>
                        </div>

                        <div className="professional-summary mrg-top-10 custom-border">
                            <p className='card-header'>Professional Summary</p>
                            <Field variant='outlined' component={TextField} type={"text"} fullWidth autoComplete="off"
                                name="professional_details.summary" id="input_hcp_edit_summary" multiline rows={2} />
                        </div>
                    </div>
                    <div className="nc-section custom-border mrg-top-10" >
                        <p className="card-header">NC Section</p>
                        <div className="input-container">
                            <Field variant='outlined' name="nc_details.dnr" type={"text"} component={TextField}
                                label="DNR" id="input_hcp_add_dnr" fullWidth autoComplete="off" />
                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.vaccine" type={"text"}
                                component={TextField} id="input_hcp_add_vaccine" label="Vaccine" fullWidth autoComplete="off">
                                {vaccine.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_vaccine_" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>
                        </div>

                        <div className="input-container">
                            <Field variant='outlined' name="nc_details.location_preference" type={"text"} component={TextField}
                                label="Preferred Location to Work" id="input_hcp_add_location_preference" fullWidth autoComplete="off" />
                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.contact_type" type={"text"}
                                component={TextField} id="input_hcp_add_contact_type" label="Contact Type" fullWidth autoComplete="off">
                                {contactType.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_contact_type" + index}>{item.label}</MenuItem>
                                ))}

                            </Field>

                        </div>

                        <div className="input-container">
                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.shift_type_preference" type={"text"}
                                component={TextField} id="input_hcp_add_shift_type_preference" label="Preference Shift Type" fullWidth autoComplete="off"
                            >
                                {shiftTypePreference.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_shift_type_preference" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>

                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.covid_facility_preference" type={"text"}
                                component={TextField} id="input_hcp_covid_preference" label="Covid (or) Non Covid Facility?" fullWidth autoComplete="off">
                                {covidPreference.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_covid_preference" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>
                        </div>


                        <div className="input-container">
                            <Field variant='outlined' name="nc_details.zone_assignment" type={"text"} component={TextField}
                                id="input_hcp_add_zone_assignment" label="Zone Assignment" fullWidth autoComplete="off" />

                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.is_fulltime_job"
                                type={"text"} component={TextField} id="input_hcp_is_fulltime_job" label="Do you have a Full-time Job?"
                                fullWidth autoComplete="off">
                                {boolAcknowledge.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_is_fulltime_job" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>
                        </div>


                        <div className="input-container">
                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.more_important_preference"
                                type={"text"} component={TextField} id="input_hcp_add_more_important_preference" label="What is more important for you?"
                                fullWidth autoComplete="off">
                                {moreImportant.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_more_important_preference" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>

                            <Field
                                SelectProps={showDropDownBelowField}
                                select
                                variant='outlined'
                                name="nc_details.is_supplement_to_income"
                                type={"text"}
                                component={TextField}
                                id="input_hcp_add_is_supplement_to_income"
                                label="Is this a Supplement to your Income ?"
                                fullWidth
                                autoComplete="off"
                            >
                                {boolAcknowledge.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_is_supplement_to_income" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>
                        </div>

                        <div className="input-container">
                            <Field
                                SelectProps={showDropDownBelowField}
                                select
                                variant='outlined'
                                name="nc_details.is_studying"
                                type={"text"}
                                component={TextField}
                                id="input_hcp_is_studying"
                                label="Are you Studying?"
                                fullWidth
                                autoComplete="off"
                            >
                                {boolAcknowledge.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_is_studying" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>

                            <Field
                                select
                                variant='outlined'
                                name="nc_details.gusto_type"
                                type={"text"}
                                component={TextField}
                                id="input_hcp_gusto_type"
                                label="Gusto"
                                fullWidth
                                autoComplete="off"
                            >
                                {gustoType.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_gusto_type" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>
                        </div>

                        <div className="input-container">
                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.is_gusto_invited"
                                type={"text"} component={TextField} id="input_hcp_add_is_gusto_invited" label="Is Gusto Invited ?" fullWidth
                                autoComplete="off">
                                {boolAcknowledge.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_is_gusto_invited" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>

                            <Field SelectProps={showDropDownBelowField} select variant='outlined' name="nc_details.is_gusto_onboarded"
                                type={"text"} component={TextField} id="input_hcp_add_is_gusto_onboarded" label="Is Gusto Onboarded ?"
                                fullWidth autoComplete="off">
                                {boolAcknowledge.map((item: any, index: any) => (
                                    <MenuItem value={item.value} id={"menu_hcp_add_is_gusto_onboarded" + index}>{item.label}</MenuItem>
                                ))}
                            </Field>


                        </div>

                        <div className="input-container">
                            <Field variant="inline" openTo="date" inputVariant='outlined' component={DateTimePicker}
                                id="input_hcp_add_last_call_date" placeholder="MM/DD/YYYY HH:MM " fullWidth autoComplete="off" InputLabelProps={{ shrink: true }}
                                label="Last Call Date" name="nc_details.last_call_date" />
                            <Field variant='outlined' name="nc_details.family_consideration" type={"text"} component={TextField}
                                id="input_hcp_add_family_consideration" label="Family Considerations" fullWidth autoComplete="off" />
                        </div>

                        <div className="input-container">
                            <Field variant='outlined' name="nc_details.other_information" type={"text"} component={TextField}
                                id="input_hcp_add_other_information" label="Other Information Gathered" fullWidth autoComplete="off" />
                        </div>
                    </div>

                    <div className="custom-border mrg-top-10 pdd-top-10 pdd-left-40 pdd-right-40 pdd-bottom-40">
                        <h3 className="card-header">Documents/Attachments</h3>
                        <div className="attachments_wrapper mrg-top-30">
                            <HcpEditAttachmentsComponent
                                attachmentsDetails={attachmentsDetails}
                                required_attachments={required_attachments}
                                handleExpiryDate={handleExpiryDate}
                                fileUpload={fileUpload}
                                previewFile={previewFile}
                                isDeleted={isDeleted}
                                deleteAttachment={deleteAttachment}
                                OnFileSelected={OnFileSelected}
                                deleteLocalAttachment={deleteLocalAttachment} />
                        </div>
                    </div>

                    <div className="mrg-top-10 custom-border">
                        <p className="card-header">Contract</p>
                        {contractDetails ? <div className="attachments">
                            <div className="custom_file">
                                <div className="d-flex">
                                    <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                                    <div className="file_details mrg-left-20">
                                    </div>
                                </div>
                                <div className="contract_actions mrg-left-5 mrg-top-10 ">
                                    <button style={{ cursor: "pointer", width: '50px' }} disabled={isContractDeleted} onClick={deleteContractFileApi} className="delete-button mrg-left-10">Delete</button>
                                </div>
                            </div>
                        </div> : <>
                            {contractFile?.wrapper?.map((item: any, index: any) => {
                                return (
                                    <div className="attachments">
                                        <div className="custom_file">
                                            <div className="d-flex">
                                                <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                                                <div className="file_details mrg-left-20">
                                                </div>
                                            </div>
                                            <div className="d-flex contract_actions mrg-left-5 mrg-top-10">
                                                <button style={{ cursor: 'pointer' }} onClick={() => previewFile(index, "contract")} className="delete-button">View</button>
                                                <button style={{ cursor: 'pointer', width: '50px' }} disabled={isContractDeleted} className="mrg-left-20 delete-button" onClick={() => deleteContractFile(index)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {contractFile?.wrapper.length >= 1 ? (
                                <></>
                            ) : (
                                <Box display="flex" gridGap="10px">
                                    <Box width="250px" className="mrg-top-10">
                                        <FileDropZoneComponent allowedTypes={".pdf"}
                                            OnFileSelected={OnContractFileUpload}
                                        />
                                    </Box>
                                </Box>
                            )}
                            <div className="input-container mrg-top-30">
                                <Field variant='outlined' component={TextField} type={"text"} fullWidth
                                    autoComplete="off" label="Rate / hr" name="rate_per_hour" required={contractFile?.wrapper[0]?.file} />
                                <Field orientation='landscape' variant="inline" openTo="date" views={["year", "month", "date"]} inputVariant='outlined' component={DatePicker}
                                    placeholder="MM/DD/YYYY" format="MM/dd/yyyy" fullWidth autoComplete="off" InputLabelProps={{ shrink: true }} required={contractFile?.wrapper[0]?.file}
                                    label="Signed On" name="signed_on" />
                                <Field variant='outlined' type={"number"} component={TextField} placeholder="Enter the date of salary credit"
                                    fullWidth autoComplete="off" InputLabelProps={{ shrink: true }} label="Salary Credit Date" required={contractFile?.wrapper[0]?.file}
                                    name="salary_credit_date" />
                            </div>
                        </>}
                    </div>

                </Form>
            )}
        </Formik>
    </div>;
}

export default EditHcpBasicDetailsComponent;
