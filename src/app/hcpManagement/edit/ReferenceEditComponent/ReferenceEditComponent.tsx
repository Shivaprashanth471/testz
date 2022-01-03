import {
  Button, Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback, useState } from "react";
import * as Yup from "yup";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { ApiService, CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ReferenceEditComponent.scss";

type ReferenceAddComponentProps = {
  onAddReference: any;
  hcpId: string;
  getReferenceDetails: any;
  reference: any;
  setReference: any;
};

interface ReferenceItem {
  name: string;
  jobTitle: string;
  contactNumber: string;
  email: string;
}

const referenceInitialState: ReferenceItem = {
  name: "",
  jobTitle: "",
  contactNumber: "",
  email: "",
};

const referenceValidation = Yup.object({
  name: Yup.string()
    .typeError("must be text")
    .min(3, "min 3 chracters")
    .trim("The contact name cannot include leading and trailing spaces")
    .required("required"),
  jobTitle: Yup.string()
    .typeError("must be text")
    .trim("The contact name cannot include leading and trailing spaces")
    .required("required"),
  contactNumber: Yup.string()
    .min(10, "min 10 digits")
    .max(10, "max 10 digits")
    .required("required")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Invalid"
    ),
  email: Yup.string()
    .typeError("must be text")
    .email("invalid")
});

const ReferenceAddComponent = ({
  onAddReference,
  hcpId,
  getReferenceDetails,
  reference,
  setReference,
}: ReferenceAddComponentProps) => {
  const [isReference, setIsReference] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<any>(null);

  const onAdd = (
    reference: ReferenceItem,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<ReferenceItem>
  ) => {
    const newReference = {
      reference_name: reference.name,
      job_title: reference.jobTitle,
      contact_method: "phone",
      phone: reference.contactNumber,
      email: reference.email,
    };

    //add new reference
    onAddReference(newReference)
      .then((resp: any) => {
        getReferenceDetails();
        CommonService.showToast(resp?.msg || 'HCP reference added', 'info')

      })
      .catch((err: any) => console.log(err));

    //clear state
    resetForm();

    //close form
    handleCancelAdd()
  };

  const handleCancelAdd = () => {
    setIsReference(false);
  };

  const handleDeleteClick = useCallback((referenceId: number) => {
    ApiService.delete(ENV.API_URL + "hcp/" + hcpId + "/reference/" + referenceId)
      .then((resp: any) => {
        getReferenceDetails();

        CommonService.showToast(resp?.msg || 'hcp reference deleted', 'error')
        setIsAddOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getReferenceDetails, hcpId])


  const openAdd = useCallback((id: any) => {
    setReferenceId(id)
    setIsAddOpen(true);
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    handleDeleteClick(referenceId)
  }, [referenceId, handleDeleteClick])

  return (
    <div className="add-container">
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent cancel={cancelAdd} confirm={confirmAdd} text1='Want to delete' hcpname={'Reference'} groupname={''} confirmationText={''} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>

      {reference.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead>
            <TableRow>
              <th>Reference Name</th>
              <th>Reference Job Title</th>
              <th>Contact Number</th>
              <th>Email</th>
            </TableRow>
          </TableHead>
          <TableBody>
            {reference.map((reference: any, index: any) => (

              <ReadOnlyRow
                key={index}
                reference={reference}
                openAdd={openAdd}
              />

            ))}
          </TableBody>
        </Table>
      )}

      {isReference ? (
        <div className="reference-add-input">
          <Formik
            initialValues={referenceInitialState}
            validateOnChange={true}
            validationSchema={referenceValidation}
            onSubmit={onAdd}
          >
            {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className='form-holder'>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    type="text"
                    name="name"
                    label="Reference Name"
                    id="input_hcp_edit_reference_name"
                  />

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    type="text"
                    name="jobTitle"
                    label="Reference Job Title"
                    id="input_hcp_edit_reference_job"
                  />
                </div>

                <div className="input-container">
                  <Field
                    inputProps={{ maxLength: 10 }}
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="contactNumber"
                    label="Contact Number"
                    id="input_hcp_edit_reference_number"
                  />

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    type="email"
                    name="email"
                    label="Email (optional)"
                    id="input_hcp_edit_reference_email"
                  />


                </div>

                <div className="hcp-common-btn-grp">
                  <Button
                    variant='outlined'
                    type="reset"
                    onClick={() => {
                      resetForm();
                      handleCancelAdd();
                    }}
                    id="btn_hcp_edit_reference_cancel"
                  >
                    Delete
                  </Button>
                  <Button
                    color='primary'
                    variant='contained'
                    type="submit"
                    id="btn_hcp_edit_reference_submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="ref-add-action">
          <p
            id='btn_hcp_add_reference'
            onClick={() => setIsReference(true)}
            className="generic-add-multiple"
          >
            + Add Reference
          </p>
        </div>
      )}

    </div>
  );
};

export default ReferenceAddComponent;
