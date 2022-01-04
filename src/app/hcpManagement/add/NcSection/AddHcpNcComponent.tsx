import { Field } from 'formik';
import { TextField } from '@material-ui/core';
import React from 'react';
import { boolAcknowledge, contactType, covidPreference,  gustoType, moreImportant, shiftTypePreference, vaccine } from "../../../../constants/data";
import { MenuItem } from "@material-ui/core";

const AddHcpNcComponent = () => {

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
        <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.dnr"
                    type={"text"}
                    component={TextField}
                    label="DNR"
                    id="input_hcp_add_dnr"
                    fullWidth
                    autoComplete="off"
                  />
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.vaccine"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_vaccine"
                    label="Vaccine"
                    fullWidth
                    autoComplete="off"
                  >
                    {vaccine.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_vaccine_" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.location_preference"
                    type={"text"}
                    component={TextField}
                    label="Preferred Location to Work"
                    id="input_hcp_add_location_preference"
                    fullWidth
                    autoComplete="off"
                  />

                  <Field
                    select
                    variant='outlined'
                    name="nc_details.contact_type"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_contact_type"
                    label="Contact Type"
                    fullWidth
                    autoComplete="off"
                  >
                    {contactType.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_contact_type" + index}>{item.label}</MenuItem>
                    ))}

                  </Field>

                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.shift_type_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_shift_type_preference"
                    label="Preference Shift Type"
                    fullWidth
                    autoComplete="off"
                  >
                    {shiftTypePreference.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_shift_type_preference" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.covid_facility_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_covid_preference"
                    label="Covid (or) Non Covid Facility?"
                    fullWidth
                    autoComplete="off"
                  >
                    {covidPreference.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_covid_preference" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>


                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.zone_assignment"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_zone_assignment"
                    label="Zone Assignment"
                    fullWidth
                    autoComplete="off"
                  />

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.is_fulltime_job"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_is_fulltime_job"
                    label="Do you have a Full-time Job?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_fulltime_job" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>


                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.more_important_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_more_important_preference"
                    label="What is more important for you?"
                    fullWidth
                    autoComplete="off"
                  >
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
                    SelectProps={showDropDownBelowField}
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
    </div>;
}

export default AddHcpNcComponent;