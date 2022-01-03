import {
  Button, InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useState } from "react";
import * as Yup from "yup";
import { ENV } from "../../../../constants";
import { designationNames } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import "./FacilityMemberEditComponent.scss";
import ReadOnlyRow from "./ReadOnlyRow";

type FacilityMemberEditComponentProps = {
  onAddMember: any;
  hcpId: string;
  members: any;
  setMembers: any;
  getFacilityMembers: () => void;
};

interface MemberType {
  name: string;
  email: string;
  phone_number: string;
  extension_number: string;
  designation: string;
}

const memberInitialState: MemberType = {
  name: "",
  phone_number: "",
  extension_number: "",
  designation: "",
  email: "",
};

const memberFormValidation = Yup.object({
  name: Yup.string()
    .typeError("must be text")
    .min(3, "min 3 chracters")
    .trim("The contact name cannot include leading and trailing spaces")
    .required(),
  email: Yup.string().typeError("must be text").email("invalid"),
  phone_number: Yup.string()
    .typeError(" must be a number")
    .matches(/^[0-9]+$/, "must be number")
    .trim("empty space not allowed")
    .max(10, 'max 10 digits')
    .required("required"),
  extension_number: Yup.number().typeError(" must be a number"),
  designation: Yup.string().typeError("must be text").required(),
});

const FacilityMemberEditComponent = ({
  onAddMember,
  hcpId,
  members,
  getFacilityMembers,
}: FacilityMemberEditComponentProps) => {
  const [isMembers, setIsMembers] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<boolean>(false);




  const onAdd = (
    member: MemberType,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<MemberType>
  ) => {
    const newMember = {
      name: member.name,
      email: member.email,
      phone_number: member.phone_number,
      extension_number: member.extension_number ? member.extension_number : "",
      designation: member.designation,
    };

    //add and update with latest data
    onAddMember(newMember)
      .then(() => getFacilityMembers())
      .catch((err: any) => console.log(err));

    //clear state
    resetForm();

    //close form
    setIsMembers(false)
  };

  const handleDeleteClick = (memberId: number) => {
    ApiService.delete(ENV.API_URL + "facility/" + hcpId + "/member/" + memberId)
      .then((resp: any) => {
        CommonService.showToast(resp?.msg || 'Facility Member Deleted', 'error')
        getFacilityMembers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }

  return (
    <div className="facility-add-container">
      {members.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead>
            <TableRow>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Extension Number</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Actions</th>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member: any) => (
              <ReadOnlyRow
                key={member?._id}
                member={member}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {isMembers ? (
        <div>
          <Formik
            initialValues={memberInitialState}
            validateOnChange={true}
            validationSchema={memberFormValidation}
            onSubmit={onAdd}
          >
            {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className={"form-holder"}>
                <div className="facility-add-input">
                  <Field
                    variant="outlined"
                    name="name"
                    type={"text"}
                    component={TextField}
                    label="Name"
                    fullWidth
                    autoComplete="off"
                    id="input_facility_member_add_name"
                  />

                  <Field
                    SelectProps={showDropDownBelowField}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {fieldType && (
                            <BackspaceIcon
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setFieldType((prevState) => !prevState)
                              }
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    select={fieldType ? false : true}
                    name="designation"
                    type={"text"}
                    component={TextField}
                    label="Designation"
                    fullWidth
                    autoComplete="off"
                    id="input_facility_member_add_designation"

                  >

                    {!fieldType &&
                      designationNames &&
                      designationNames.map((item: any, index) => (
                        <MenuItem value={item.value} key={index}>
                          {item.label}
                        </MenuItem>
                      ))}
                    <MenuItem
                      onClick={() => setFieldType((prevState) => !prevState)}
                    >
                      Other
                    </MenuItem>
                  </Field>
                </div>
                <div className="facility-add-input">
                  <div className="number-container">
                    <Field
                      inputProps={{ maxLength: 10 }}
                      className='phone_number'
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
                      className='extension_number'
                      variant="outlined"
                      name="extension_number"
                      type={"text"}
                      component={TextField}
                      label="Extension No."
                      autoComplete="off"
                      id="input_facility_member_add_extension_number"
                    />
                  </div>
                  <Field
                    variant="outlined"
                    name="email"
                    type={"email"}
                    component={TextField}
                    label="Email"
                    fullWidth
                    autoComplete="off"
                    id="input_facility_member_add_email"
                  />
                </div>
                <div className="facility-add-btn-grp">
                  <Button
                    variant='outlined'
                    id="btn_facility_member_add_cancel"
                    type="reset"
                    onClick={() => {
                      resetForm();
                      setIsMembers(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button id="btn_facility_member_add_submit" color='primary' type="submit" variant='contained'>
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <>
          <div className="facility-add-action">
            <p
              id="btn_facility_member_add_open"
              onClick={() => setIsMembers(true)}
              className="generic-add-multiple"
            >
              + Add a Facility Member
            </p>
          </div>
        </>
      )}

    </div>
  );
};

export default FacilityMemberEditComponent;
