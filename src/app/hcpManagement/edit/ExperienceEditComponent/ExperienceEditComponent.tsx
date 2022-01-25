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
import React, { useCallback, useState } from "react";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { acknowledgement } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import { experienceValidation } from "../../add/ExperienceAddComponent/ExperienceValidation";
import "./ExperienceEditComponent.scss";
import ReadOnlyRow from "./ReadOnlyRow";

interface ExperienceItem {
  facilityName: string;
  speciality: string;
  hcpType: string;
  location: string;
  startDate: any;
  endDate: any;
  stillWorkingHere: any;
  skills: any
}

const experienceInitialState: ExperienceItem = {
  facilityName: "",
  speciality: "",
  hcpType: "",
  location: "",
  startDate: null,
  endDate: null,
  stillWorkingHere: "",
  skills: ""
};



type ExperienceAddComponentProps = {
  getExperienceDetails: any;
  hcpId: string;
  onAddExperience: any;
  experiences: any;
  setExperience: any; hcpTypeSpecialities: any;
  hcpTypes: any;
  handleHcpTypeChange?: any;
};

const ExperienceAddComponent = ({ hcpTypeSpecialities, hcpTypes, handleHcpTypeChange,
  getExperienceDetails,
  onAddExperience,
  hcpId,
  experiences,
  setExperience,
}: ExperienceAddComponentProps) => {
  const [isExperiences, setIsExperiences] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(true)
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [experienceId, setExperienceId] = useState<any>(null);
  const [isConfirm,setIsConfirm] = useState<boolean>(false);

  const onAdd = (
    experience: ExperienceItem,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<ExperienceItem>
  ) => {

    const newExperience = {
      facility_name: experience.facilityName,
      specialisation: experience.speciality,
      unit: experience.speciality,
      location: experience.location,
      start_date: moment(experience.startDate).format('YYYY-MM'),
      end_date: experience.endDate ? moment(experience.endDate).format('YYYY-MM') : '',
      position_title: experience.hcpType,
      still_working_here: experience.stillWorkingHere,
      exp_type: "fulltime",
      skills: experience.skills
    };


    //add new experience
    onAddExperience(newExperience)
      .then((resp: any) => {
        getExperienceDetails()
        CommonService.showToast(resp?.msg || 'HCP experience added', 'info')
        setIsExperiences(false);
        resetForm();
      })
      .catch((err: any) => console.log(err));
  };

  const handleDeleteClick = useCallback((experienceId: number) => {
    setIsConfirm(true)
    ApiService.delete(ENV.API_URL + "hcp/" + hcpId + "/experience/" + experienceId).then((resp: any) => {
      getExperienceDetails()
      CommonService.showToast(resp?.msg || 'hcp experience deleted', 'success')
      setIsConfirm(false)
      setIsAddOpen(false);
    })
      .catch((err) => {
        console.log(err);
        setIsConfirm(false)
      });
  }, [getExperienceDetails, hcpId])

  const sortedExpData = CommonService.sortDatesByLatest(experiences, 'start_date')


  const openAdd = useCallback((id: any) => {
    setExperienceId(id)
    setIsAddOpen(true);
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    handleDeleteClick(experienceId)
  }, [experienceId, handleDeleteClick])

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
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent  isConfirm={isConfirm} cancel={cancelAdd} confirm={confirmAdd} text1='Want to delete' hcpname={'Work Experience'} groupname={''} confirmationText={''} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>
      {experiences.length > 0 && (
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
            {sortedExpData.map((experience: any, index: any) => {
              return <ReadOnlyRow
                key={index}
                experience={experience}
                openAdd={openAdd}
              />
            }
            )}
          </TableBody>
        </Table>
      )}

      {isExperiences ? (
        <Formik
          initialValues={experienceInitialState}
          validateOnChange={true}
          validationSchema={experienceValidation}
          onSubmit={onAdd}
        >
          {({ isSubmitting, handleSubmit, isValid, setFieldValue, resetForm }) => (
            <div className="add-input">
              <Form className={"form-holder"}>
                <div className="input-container">
                  <Field
                    variant='outlined'
                    fullWidth
                    component={TextField}
                    name="facilityName"
                    id="input_hcp_edit_experience_facility_name"
                    label="Facility Name"
                  />

                  <Field
                    variant='outlined'
                    fullWidth
                    component={TextField}
                    name="location"
                    id="input_hcp_edit_experience_location"
                    label="Location"
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
                    id="input_hcp_edit_experience_position_title"
                  >
                    {hcpTypes.map((item: any, index: number) => (
                      <MenuItem value={item.code} key={'hcp_type_' + index} id={"menu_hcp_edit_experience_hcp_type" + item.name}>
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
                    id="input_hcp_edit_experience_speciality"
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
                    fullWidth
                    component={TextField}
                    name="skills"
                    label="Skills (Optional)"
                    id="input_hcp_edit_experience_skills"
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
                    id="input_hcp_edit_experience_working_here"

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
                    {acknowledgement?.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_edit_experience_" + index}>{item.label}</MenuItem>
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
                    id="input_hcp_edit_experience_start_date"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className="input-container minor">
                  {
                    showEndDate && <Field
                      fullWidth
                      variant="inline"
                      openTo="year"
                      views={["year", "month"]}
                      inputVariant='outlined'
                      component={DatePicker}
                      placeholder="MM/YYYY"
                      name="endDate"
                      id="input_hcp_edit_experience_end_date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                    />
                  }
                </div>

                <div className="hcp-common-btn-grp">
                  <Button
                    id="btn_hcp_edit_experience_cancel"
                    variant='outlined'
                    onClick={() => {
                      resetForm();
                      setIsExperiences(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button color='primary' variant='contained' type="submit" id="btn_hcp_edit_experience_submit" className={isSubmitting?"has-loading-spinner":""} disabled={isSubmitting}>
                  {isSubmitting?"Saving":"Save"}
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      ) : (
        <div className="exp-add-action">
          <p
            id='btn_hcp_add_experience'
            onClick={() => setIsExperiences(true)}
            className="generic-add-multiple"
          >
            + Add Work Experience
          </p>
        </div>
      )}

    </div>
  );
};

export default ExperienceAddComponent;
