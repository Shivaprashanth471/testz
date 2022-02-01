import { Button, Table, TableBody, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./ReferenceAddComponent.scss";
import { referenceValidation } from "./ReferenceValidation";

type ReferenceAddComponentProps = {
  references: any;
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

const ReferenceAddComponent = ({ references, setReference }: ReferenceAddComponentProps) => {
  const [isReference, setIsReference] = useState<boolean>(false);

  const onAdd = (reference: ReferenceItem, { setSubmitting, setErrors, resetForm }: FormikHelpers<ReferenceItem>) => {
    const newReference = {
      tempId: nanoid(),
      reference_name: reference.name,
      job_title: reference.jobTitle,
      contact_method: "phone",
      phone: reference.contactNumber,
      email: reference.email,
    };

    const newReferences = [...references, newReference];
    setReference(newReferences);

    resetForm();
    handleCancelAdd();
    CommonService.showToast("HCP reference added", "info");
  };

  const handleCancelAdd = () => {
    setIsReference(false);
  };

  const handleDeleteClick = (referenceId: string) => {
    const newReferences = [...references];
    const index = references.findIndex((reference: any) => reference.tempId === referenceId);
    newReferences.splice(index, 1);
    setReference(newReferences);
    CommonService.showToast("HCP reference deleted", "success");
  };

  return (
    <div className="add-container">
      {references.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead className={"mat-thead"}>
             <TableRow className={"mat-tr"}>
              <th>Reference Name</th>
              <th>Reference Job Title</th>
              <th>Contact Number</th>
              <th>Email</th>
            </TableRow>
          </TableHead>
         <TableBody className={"mat-tbody"}>
            {references.map((reference: any) => (
              <ReadOnlyRow reference={reference} handleDeleteClick={handleDeleteClick} />
            ))}
          </TableBody>
        </Table>
      )}

      {isReference ? (
        <div className="reference-add-input">
          <Formik initialValues={referenceInitialState} validateOnChange={true} validationSchema={referenceValidation} onSubmit={onAdd}>
            {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
              <Form className={"form-holder"}>
                <div className="input-container">
                  <Field variant="outlined" component={TextField} fullWidth type="text" name="name" label="Reference Name" autoComplete="off" id="input_hcp_add_reference_name" />
                  <Field variant="outlined" component={TextField} fullWidth type="text" name="jobTitle" label="Reference Job Title" autoComplete="off" id="input_hcp_add_reference_job" />
                </div>

                <div className="input-container">
                  <Field inputProps={{ maxLength: 10 }} type="number" variant="outlined" component={TextField} fullWidth name="contactNumber" label="Contact Number" autoComplete="off" id="input_hcp_add_reference_number" />

                  <Field variant="outlined" component={TextField} fullWidth type="email" name="email" label="Email (optional)" autoComplete="off" id="input_hcp_add_reference_email" />
                </div>

                <div className="hcp-common-btn-grp">
                  <Button
                    variant="outlined"
                    type="reset"
                    onClick={() => {
                      resetForm();
                      handleCancelAdd();
                    }}
                    id="btn_hcp_add_reference_cancel"
                  >
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" type="submit" id="btn_hcp_add_reference_submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="ref-add-action">
          <Tooltip title={"Add New Reference"}>
            <p id="btn_hcp_add_reference" onClick={() => setIsReference(true)} className="generic-add-multiple">
              {" "}
              + Add Reference
            </p>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ReferenceAddComponent;
