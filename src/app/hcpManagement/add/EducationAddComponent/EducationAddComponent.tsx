import {
  Button, Table,
  TableBody,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import moment from "moment";
import { nanoid } from 'nanoid';
import React, { useState } from "react";
import { CommonService } from "../../../../helpers";
import "./EducationAddComponent.scss";
import { educationValidation } from "./EducationValidation";
import ReadOnlyRow from "./ReadOnlyRow";


type EducationAddComponentProps = {
  educations: any;
  setEducation: any;
};

interface EducationItem {
  institute_name: string;
  degree: string;
  location: string;
  start_date: any;
  graduation_date: any;
}

const educationInitialState: EducationItem = {
  institute_name: "",
  degree: "",
  location: "",
  start_date: null,
  graduation_date: null,
};



const EducationAddComponent = ({
  educations,
  setEducation,
}: EducationAddComponentProps) => {
  const [isEducation, setIsEducation] = useState<boolean>(false);


  const onAdd = (
    education: EducationItem,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<EducationItem>
  ) => {

    const newEducation = {
      tempId: nanoid(),
      institute_name: education.institute_name,
      degree: education.degree,
      location: education.location,
      start_date: moment(education.start_date).format('YYYY-MM'),
      graduation_date: moment(education.graduation_date).format('YYYY-MM'),
    };

    const newEducations = [...educations, newEducation];
    setEducation(newEducations);
    resetForm();
    handleCancelEducation()
  };

  const handleCancelEducation = () => {
    setIsEducation(false);
  };

  const handleDeleteClick = (educationId: number) => {
    const newEducations = [...educations];
    const index = educations.findIndex(
      (education: any) => education.tempId === educationId
    );
    newEducations.splice(index, 1);
    setEducation(newEducations);
  };

  const sortedEducationData = CommonService.sortDatesByLatest(educations, 'start_date')

  return (
    <div className="education-add-container">
      {educations.length > 0 && (
        <Table className="mrg-top-50 border">
          <TableHead>
            <TableRow>
              <th>Institution Name</th>
              <th>Degree</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEducationData.map((education: any, index: number) => (
              <>
                <ReadOnlyRow
                  key={index}
                  education={education}
                  handleDeleteClick={handleDeleteClick}
                />
              </>
            ))}
          </TableBody>
        </Table>
      )}

      {isEducation ? (
        <Formik
          initialValues={educationInitialState}
          validateOnChange={true}
          validationSchema={educationValidation}
          onSubmit={onAdd}
        >
          {({ isSubmitting, handleSubmit, isValid, resetForm }) => (
            <Form className={"form-name form-holder"}>
              <div className="add-input">
                <div className="input-container">
                  <Field
                    variant="outlined"
                    fullWidth
                    component={TextField}
                    name="institute_name"
                    label="Institution Name"
                    id="input_hcp_add_education_institution_name"
                  />
                  <Field
                    variant="outlined"
                    fullWidth
                    component={TextField}
                    name="location"
                    id="input_hcp_add_education_location"
                    label="Location"
                  />
                </div>

                <div className="input-container">
                  <Field
                    variant="outlined"
                    fullWidth component={TextField} name="degree" label="Degree" />

                  <Field
                    variant="inline"
                    openTo="year"
                    views={["year", "month"]}
                    inputVariant='outlined'
                    component={DatePicker}
                    placeholder="MM/YYYY"
                    fullWidth
                    name="start_date"
                    label="Start Date"
                    id="input_hcp_add_education_start_date"
                    InputLabelProps={{ shrink: true }}
                  />


                </div>
                <div className="input-container minor">
                  <Field
                    variant="inline"
                    openTo="year"
                    views={["year", "month"]}
                    inputVariant='outlined'
                    fullWidth
                    component={DatePicker}
                    name="graduation_date"
                    placeholder="MM/YYYY"
                    label="End Date"
                    id="input_hcp_add_education_end_date"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>


                <div className="hcp-common-btn-grp">
                  <Button variant='outlined' onClick={() => {
                    resetForm()
                    handleCancelEducation();
                  }} id="btn_hcp_add_education_close">
                    Delete
                  </Button>
                  <Button variant='contained' color='primary' type="submit" id="btn_hcp_add_education_submit">
                    Save
                  </Button>
                </div>

              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="edu-add-action">
          <p
            id='btn_hcp_add_education'
            onClick={() => setIsEducation(true)}
            className="generic-add-multiple"
          >
            + Add Education
          </p>
        </div>
      )}


    </div>
  );
};

export default EducationAddComponent;


