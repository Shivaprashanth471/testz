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
import React, { useCallback, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { designationNames } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import { memberFormValidation } from "../../add/FacilityMemberAddComponent/FacilityMemberFormValidation";
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


const FacilityMemberEditComponent = ({
  onAddMember,
  hcpId,
  members,
  getFacilityMembers,
}: FacilityMemberEditComponentProps) => {
  const [isMembers, setIsMembers] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [facilityId, setFacilityId] = useState<any>(null);
  const [isConfirm,setIsConfirm] = useState<boolean>(false)

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

    onAddMember(newMember)
      .then(() => getFacilityMembers())
      .catch((err: any) => console.log(err));

    resetForm();
    setIsMembers(false)
  };

  const handleDeleteClick = useCallback((memberId: number) => {
    setIsConfirm(true)
    ApiService.delete(ENV.API_URL + "facility/" + hcpId + "/member/" + memberId)
      .then((resp: any) => {
        CommonService.showToast(resp?.msg || 'Facility Member Deleted', 'error')
        getFacilityMembers();
        setIsAddOpen(false);
        setIsConfirm(false)
      })
      .catch((err) => {
        console.log(err);
        setIsConfirm(false)
      });
  }, [getFacilityMembers, hcpId])

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }

  const openAdd = useCallback((id: any) => {
    setFacilityId(id)
    setIsAddOpen(true);
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    handleDeleteClick(facilityId)
  }, [facilityId, handleDeleteClick])

  return (
    <div className="facility-add-container">
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent cancel={cancelAdd} confirm={confirmAdd} isConfirm={isConfirm} text1='Want to delete' hcpname={'Facility Member'} groupname={''} confirmationText={''} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>
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
                openAdd={openAdd}
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
                      inputProps={{ maxLength: 10 }}
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
