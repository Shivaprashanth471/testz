import {
  Button, MenuItem, Table,
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
import { acknowledgement } from "../../../../constants/data";
import { CommonService } from "../../../../helpers";
import "./ExperienceAddComponent.scss";
import ReadOnlyRow from "./ReadOnlyRow";

type ExperienceAddComponentProps = {
  handleCalcSpecialities: any;
  handleCalcExperience: any;
  hcpTypeSpecialities: any;
  hcpTypes: any;
  experiences: any;
  setExperience: any;
  handleHcpTypeChange?: any;

};

interface ExperienceItem {
  facilityName: string;
  speciality: string;
  hcpType: string;
  location: string;
  startDate: any;
  endDate: any;
  stillWorkingHere: any;
  skills: any;
}

const experienceInitialState: ExperienceItem = {
  facilityName: "",
  speciality: "",
  hcpType: "",
  location: "",
  startDate: null,
  endDate: null,
  stillWorkingHere: "",
  skills: "",
};

const experienceValidation = Yup.object({
  facilityName: Yup.string()
    .typeError("must be text")
    .min(3, "min 3 chracters")
    .trim("")
    .required("required"),
  speciality: Yup.string()
    .typeError("must be text")
    .trim("")
    .required("required"),
  hcpType: Yup.string()
    .typeError("must be number")
    .trim()
    .required("required"),
  location: Yup.string().typeError("must be date").trim().required("required"),
  startDate: Yup.string().typeError("must be date").required("required").nullable(),
  endDate: Yup.string().typeError("must be date").nullable(),
  stillWorkingHere: Yup.string().trim().required("required"),
  skills: Yup.string().trim()
});

const ExperienceAddComponent = ({
  handleCalcSpecialities,
  handleCalcExperience,
  hcpTypeSpecialities,
  hcpTypes,
  experiences,
  setExperience,
  handleHcpTypeChange,
}: ExperienceAddComponentProps) => {
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
      facility_name: experience.facilityName,
      specialisation: experience.speciality,
      unit: experience.speciality,
      location: experience.location,
      start_date: moment(experience.startDate).format('YYYY-MM'),
      end_date: experience.endDate ? moment(experience.endDate).format('YYYY-MM') : '',
      exp_type: "fulltime",
      position_title: experience.hcpType,
      still_working_here: experience.stillWorkingHere,
      skills: experience.skills
    };

    const newExperiences = [...experiences, newExperience];
    setExperience(newExperiences);

    resetForm();
    handleCancelShift()
    handleCalcExperience(newExperiences)
    handleCalcSpecialities(newExperiences)
  };

  const handleCancelShift = () => {
    setIsExperiences(false);
  };

  const handleDeleteClick = (experienceId: string) => {
    const newExperiences = [...experiences];
    const index = experiences.findIndex(
      (experience: any) => experience.tempId === experienceId
    );
    newExperiences.splice(index, 1);
    setExperience(newExperiences);
    handleCalcExperience(newExperiences)
    handleCalcSpecialities(newExperiences)
  };

  const sortedExpData = CommonService.sortDatesByLatest(experiences, 'start_date')

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
    <div className="add-container">
      {
        experiences.length > 0 && (
          <Table className="mrg-top-50">
            <TableHead>
              <TableRow>
                <th>Facility Name</th>
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
        )
      }

      {isExperiences ? (
        <div className="add-input">
          <Formik
            initialValues={experienceInitialState}
            validateOnChange={true}
            validationSchema={experienceValidation}
            onSubmit={onAdd}
          >
            {({ isSubmitting, handleSubmit, isValid, setFieldValue, resetForm }) => (
              <Form className={"form-holder"}>
                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="facilityName"
                    label="Facility Name"
                    id="input_hcp_add_experience_facility_name"
                  />

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="location"
                    label="Location"
                    id="input_hcp_add_experience_location"
                  />
                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    onChange={(e: any) => {
                      const hcpType = e.target.value;
                      setFieldValue("hcpType", hcpType);
                      handleHcpTypeChange(hcpType);
                    }}
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="hcpType"
                    label="Position Title"
                    id="input_hcp_add_experience_position_title"
                  >
                    {hcpTypes.map((item: any, index: number) => (
                      <MenuItem value={item.code} key={'hcp_type_' + index} id={"menu_hcp_add_experience_hcp_type" + item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="speciality"
                    label="Speciality"
                    id="input_hcp_add_experience_speciality"
                  >
                    {hcpTypeSpecialities &&
                      hcpTypeSpecialities.map((item: any, index: any) => (
                        <MenuItem value={item.code} key={'hcp_type_specialities_' + index} id={"input_hcp_add_speciality_" + index}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="skills"
                    label="Skills (optional)"
                    id="input_hcp_add_experience_skills"
                  />
                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
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
                    {acknowledgement.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_experience_" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                  <Field
                    fullWidth
                    variant="inline"
                    openTo="year"
                    views={["year", "month"]}
                    inputVariant='outlined'
                    component={DatePicker}
                    placeholder="MM/YYYY"
                    name="startDate"
                    label="Start Date"
                    id="input_hcp_add_experience_start_date"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className='input-container minor'>
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
                      id="input_hcp_add_experience_end_date"
                      InputLabelProps={{ shrink: true }}
                    />
                  }
                </div>

                <div className="hcp-common-btn-grp">
                  <Button variant='outlined'
                    type="reset"
                    onClick={() => {
                      resetForm();
                      handleCancelShift();
                    }}
                    id="icon_hcp_add_experience_close"
                  >
                    Delete
                  </Button >
                  <Button color='primary' variant='contained' type="submit" id="icon_hcp_add_experience_submit">
                    Save
                  </Button >
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="exp-add-action">
          <p
            id='btn_hcp_add_experience'
            onClick={() => setIsExperiences(true)}
            className="generic-add-multiple"
          >+ Add Work Experience
          </p>
        </div>
      )
      }


    </div >
  );
};

export default ExperienceAddComponent;
