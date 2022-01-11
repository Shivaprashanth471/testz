import {
  Button, MenuItem,
  Table,
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
import * as Yup from "yup";
import { CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./VolunteerExperienceAddComponent.scss";

type VolunteerExperienceAddComponentProps = {
  experiences: any;
  setExperience: any;
};

interface ExperienceItem {
  organisation: string;
  location: string;
  stillWorkingHere: string;
  startDate: any;
  endDate: any;
  speciality: string;
  positionTitle: string;
  skills: any;
}

const experienceInitialState: ExperienceItem = {
  organisation: "",
  location: "",
  stillWorkingHere: "",
  startDate: null,
  endDate: null,
  speciality: "",
  positionTitle: "",
  skills: ""
};

const experienceValidation = Yup.object({
  organisation: Yup.string()
    .typeError("must be text")
    .min(3, "min 3 letters")
    .trim("")
    .required("required"),
  stillWorkingHere: Yup.string().trim().required("required"),
  speciality: Yup.string()
    .typeError("must be text")
    .trim("")
    .required("required"),
  positionTitle: Yup.string()
    .typeError("must be number")
    .trim()
    .required("required"),
  location: Yup.string().typeError("must be date").trim().required("required"),
  startDate: Yup.string().typeError("must be date").required("required").nullable(),
  endDate: Yup.string().typeError("must be date").nullable(),
  skills: Yup.string().typeError("must be text").trim()
});

const VolunteerExperienceAddComponent = ({
  experiences,
  setExperience,
}: VolunteerExperienceAddComponentProps) => {
  const [isExperiences, setIsExperiences] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(true);

  const handleAcceptedDate = (startDate: any, endDate: any): boolean => {
    console.log(moment(endDate).isAfter(startDate))
    return moment(endDate).isAfter(startDate)

  }

  const onAdd = (
    experience: ExperienceItem,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<ExperienceItem>
  ) => {

    let isAccepted: boolean = true;
    if (experience?.endDate) {
      isAccepted = handleAcceptedDate(experience.startDate, experience.endDate)
    }

    if (!isAccepted) {
      CommonService.showToast("Start Date can not be greater than End Date")
      setSubmitting(false)
      return
    }
    const newExperience = {
      tempId: nanoid(),
      facility_name: experience.organisation,
      specialisation: experience.speciality,
      unit: experience.speciality,
      still_working_here: experience.stillWorkingHere,
      location: experience.location,
      start_date: moment(experience.startDate).format('YYYY-MM'),
      end_date: experience.endDate ? moment(experience.endDate).format('YYYY-MM') : '',
      position_title: experience.positionTitle,
      exp_type: "volunteer",
      skills: experience.skills,
    };

    const newExperiences = [...experiences, newExperience];
    setExperience(newExperiences);

    resetForm();
    handleCancelExperience()
  };

  const handleCancelExperience = () => {
    setIsExperiences(false);
  };

  const handleDeleteClick = (experienceId: number) => {
    const newExperiences = [...experiences];
    const index = experiences.findIndex(
      (experience: any) => experience.tempId === experienceId
    );
    newExperiences.splice(index, 1);
    setExperience(newExperiences);
  };

  const sortedExpData = CommonService.sortDatesByLatest(experiences, 'start_date')


  return (
    <div className="add-container">
      {experiences.length > 0 && (
        <Table className="mrg-top-50">
          <TableHead>
            <TableRow>
              <th>Organisation Name</th>
              <th>Location</th>
              <th>Position Title</th>
              <th style={{ width: '15%' }}>Speciality</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Skills</th>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedExpData.map((experience: any, index: number) => (
              <>
                <ReadOnlyRow
                  key={index}
                  experience={experience}
                  handleDeleteClick={handleDeleteClick}
                />
              </>
            ))}
          </TableBody>
        </Table>
      )}

      {isExperiences ? (
        <div className="add-input">
          <Formik
            initialValues={experienceInitialState}
            validateOnChange={true}
            validationSchema={experienceValidation}
            onSubmit={onAdd}
          >
            {({ isSubmitting, handleSubmit, isValid, resetForm, setFieldValue }) => (
              <Form className={"form-holder"}>
                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="organisation"
                    label="Organisation"
                    id="input_hcp_add_Vexperience_name"
                  />

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="location"
                    label="Location"
                    id="input_hcp_add_Vexperience_location"
                  />
                </div>

                <div className="input-container">

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="positionTitle"
                    label="Position Title"
                    id="input_hcp_add_Vexperience_position"
                  />
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="speciality"
                    label="Speciality"
                    id="input_hcp_add_Vexperience_speciality"
                  />

                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="skills"
                    label="Skills (optional)"
                    id="input_hcp_add_Vexperience_skills"
                  />
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    fullWidth
                    select
                    component={TextField}
                    name="stillWorkingHere"
                    label="Still Working ?"
                    id="input_hcp_add_Vexperience_working_here"
                    onChange={(e: any) => {
                      const isWorking = e.target.value;
                      if (isWorking === '1') {
                        setFieldValue('stillWorkingHere', isWorking)
                        setFieldValue('endDate', null)
                        setShowEndDate(false)
                      } else {
                        setFieldValue('stillWorkingHere', isWorking)
                        setShowEndDate(true)
                      }

                    }}
                  >
                    {[
                      { value: "1", label: "Yes" },
                      { value: "0", label: "No" },
                    ].map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_Vexperience_" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                  <Field
                    openTo="year"
                    views={["year", "month"]}
                    inputVariant='outlined'
                    component={DatePicker}
                    placeholder="MM/YYYY"
                    variant='inline'
                    fullWidth
                    name="startDate"
                    id="input_hcp_add_Vexperience_start_date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className="input-container minor">
                  {
                    showEndDate && <Field
                      openTo="year"
                      views={["year", "month"]}
                      inputVariant='outlined'
                      component={DatePicker}
                      placeholder="MM/YYYY"
                      variant='inline'
                      fullWidth
                      name="endDate"
                      label="End Date"
                      id="input_hcp_add_Vexperience_end_date"
                      InputLabelProps={{ shrink: true }}
                    />
                  }
                </div>

                <div className="hcp-common-btn-grp">
                  <Button variant='outlined' onClick={() => {
                    resetForm();
                    handleCancelExperience()
                  }} id="icon_hcp_add_Vexperience_cancel">
                    Delete
                  </Button>
                  <Button variant='contained' color='primary' type="submit" id="icon_hcp_add_Vexperience_submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="exp-add-action">
          <p
            id='btn_hcp_add_vol_experience'
            onClick={() => setIsExperiences(true)}
            className="generic-add-multiple"
          >
            + Add Volunteer Experience
          </p>
        </div>
      )}


    </div>
  );
};

export default VolunteerExperienceAddComponent;
