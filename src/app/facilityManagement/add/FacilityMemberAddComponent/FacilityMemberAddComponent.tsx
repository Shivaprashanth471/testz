import { Button, MenuItem, Table, TableBody, TableHead, TableRow, Tooltip } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import BackspaceIcon from "@material-ui/icons/Backspace";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { designationNames } from "../../../../constants/data";
import { CommonService } from "../../../../helpers";
import "./FacilityMemberAddComponent.scss";
import { memberFormValidation } from "./FacilityMemberFormValidation";
import ReadOnlyRow from "./ReadOnlyRow";

type FacilityMemberAddComponentProps = {
  members: any;
  setMembers: any;
};

interface MemberAddType {
  name: string;
  email: string;
  phone_number: string;
  extension_number: string;
  designation: string;
}

const memberInitialState: MemberAddType = {
  name: "",
  phone_number: "",
  extension_number: "",
  designation: "",
  email: "",
};

const FacilityMemberAddComponent = ({ members, setMembers }: FacilityMemberAddComponentProps) => {
  const [isMembers, setIsMembers] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<boolean>(false);

  const handleCancelAdd = () => {
    setIsMembers(false);
  };

  const handleDeleteClick = (memberId: number) => {
    const newMembers = [...members];
    const index = members.findIndex((member: any) => member?.tempId === memberId);
    newMembers.splice(index, 1);
    setMembers(newMembers);
    CommonService.showToast("Facility member deleted", "success");
  };

  const onAdd = (member: MemberAddType, { setSubmitting, setErrors, resetForm }: FormikHelpers<MemberAddType>) => {
    const newMember = {
      tempId: nanoid(),
      name: member.name,
      email: member.email,
      phone_number: member.phone_number,
      extension_number: member.extension_number,
      designation: member.designation,
    };

    const newMembers = [...members, newMember];
    setMembers(newMembers);

    resetForm();
    handleCancelAdd();
    CommonService.showToast("Facility member added", "info");
  };

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      getContentAnchorEl: null,
    },
  };

  return (
    <div className="facility-add-container">
      {members.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead className={"mat-thead"}>
             <TableRow className={"mat-tr"}>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Extension Number</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Actions</th>
            </TableRow>
          </TableHead>
         <TableBody className={"mat-tbody"}>
            {members.map((member: any, index: any) => (
              <ReadOnlyRow key={member?.tempId} member={member} handleDeleteClick={handleDeleteClick} />
            ))}
          </TableBody>
        </Table>
      )}

      {isMembers ? (
        <div>
          <Formik initialValues={memberInitialState} validateOnChange={true} validationSchema={memberFormValidation} onSubmit={onAdd}>
            {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className={"form-holder"}>
                <div className="facility-add-input">
                  <Field variant="outlined" name="name" type={"text"} component={TextField} label="Name" fullWidth autoComplete="off" id="input_facility_member_add_name" />

                  <Field
                    SelectProps={showDropDownBelowField}
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{fieldType && <BackspaceIcon id="icon_facility_member_add_clear" style={{ cursor: "pointer" }} onClick={() => setFieldType((prevState) => !prevState)} />}</InputAdornment>,
                    }}
                    select={fieldType ? false : true}
                    id="input_facility_member_add_designation"
                    name="designation"
                    type={"text"}
                    component={TextField}
                    label="Designation"
                    fullWidth
                    autoComplete="off"
                  >
                    {!fieldType &&
                      designationNames &&
                      designationNames.map((item: any, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.label}
                        </MenuItem>
                      ))}
                    <MenuItem onClick={() => setFieldType((prevState) => !prevState)}>Other</MenuItem>
                  </Field>
                </div>
                <div className="facility-add-input">
                  <div className="number-container">
                    <Field
                      inputProps={{ maxLength: 10 }}
                      className="phone_number"
                      variant="outlined"
                      name="phone_number"
                      type={"text"}
                      component={TextField}
                      label="Contact Number"
                      fullWidth
                      autoComplete="off"
                      id="input_facility_member_add_phone_number"
                    />

                    <Field
                      className="extension_number"
                      inputProps={{ maxLength: 10 }}
                      variant="outlined"
                      name="extension_number"
                      type={"text"}
                      component={TextField}
                      label="Extension No."
                      autoComplete="off"
                      id="input_facility_member_add_extension_number"
                    />
                  </div>

                  <Field variant="outlined" name="email" type={"email"} component={TextField} label="Email" fullWidth autoComplete="off" id="input_facility_member_add_email" />
                </div>

                <div className="facility-add-btn-grp mrg-top-20">
                  <Button
                    id="btn_facility_member_add_cancel"
                    type="reset"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      resetForm();
                      handleCancelAdd();
                    }}
                  >
                    Delete
                  </Button>

                  <Button type="submit" variant="contained" color="primary" id="btn_facility_member_add_submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="facility-add-action">
          <Tooltip title={"Add New Facility Member"}>
            <p id="btn_facility_member_add_open" onClick={() => setIsMembers(true)} className="generic-add-multiple">
              + Add a Facility Member
            </p>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
export default FacilityMemberAddComponent;
