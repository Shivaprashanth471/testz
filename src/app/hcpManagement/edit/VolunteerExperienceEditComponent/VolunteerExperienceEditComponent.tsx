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
import React, { useCallback, useState } from "react";
import * as Yup from "yup";
import DialogComponent from "../../../../components/DialogComponent";
import VitawerksConfirmComponent from "../../../../components/VitawerksConfirmComponent";
import { ENV } from "../../../../constants";
import { acknowledgement } from "../../../../constants/data";
import { ApiService, CommonService } from "../../../../helpers";
import ReadOnlyRow from "./ReadOnlyRow";
import "./VolunteerExperienceEditComponent.scss";

type VolunteerExperienceAddComponentProps = {
  getExperienceDetails: any;
  hcpId: string;
  onAddExperience: any;
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
  skills: any
}

const experienceInitialState: ExperienceItem = {
  organisation: "",
  location: "",
  stillWorkingHere: "",
  startDate: null,
  endDate: null,
  speciality: "",
  positionTitle: "",
  skills: "",
};

const experienceValidation = Yup.object({
  organisation: Yup.string().typeError("must be text").min(3, "min 3 letter").trim("").required("required"),
  stillWorkingHere: Yup.string().trim().required("required"),
  speciality: Yup.string().typeError("must be text").trim("").required("required"),
  positionTitle: Yup.string().typeError("must be number").trim().required("required"),
  location: Yup.string().typeError("must be date").trim().required("required"),
  startDate: Yup.string().typeError("must be date").required("required").nullable(),
  endDate: Yup.string().typeError("must be date").nullable(),
  skills: Yup.string().typeError("must be text").trim()
});

const VolunteerExperienceAddComponent = ({
  getExperienceDetails,
  hcpId,
  onAddExperience,
  experiences,
  setExperience,
}: VolunteerExperienceAddComponentProps) => {
  const [isExperiences, setIsExperiences] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(true);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [vExperienceId, setVExperience] = useState<any>(null);

  const onAdd = (
    experience: ExperienceItem,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<ExperienceItem>
  ) => {
    const newExperience = {
      facility_name: experience.organisation,
      specialisation: experience.speciality,
      unit: experience.speciality,
      still_working_here: experience.stillWorkingHere,
      location: experience.location,
      start_date: moment(experience.startDate).format('YYYY-MM'),
      end_date: experience.endDate ? moment(experience.endDate).format('YYYY-MM') : '',
      position_title: experience.positionTitle,
      exp_type: "volunteer",
      skills: experience.skills
    };

    //add new volunteer experience
    onAddExperience(newExperience).then((resp: any) => {
      getExperienceDetails();
      CommonService.showToast(resp?.msg || 'HCP volunteer experience added', 'info')
    }).catch((err: any) => console.log(err));

    //clear state
    resetForm();

    //close form
    handleCancelExperience()
  };

  const handleCancelExperience = () => {
    setIsExperiences(false);
  };

  const handleDeleteClick = useCallback((experienceId: number) => {
    ApiService.delete(
      ENV.API_URL + "hcp/" + hcpId + "/experience/" + experienceId
    )
      .then((resp: any) => {
        getExperienceDetails();
        setIsAddOpen(false);
        CommonService.showToast(resp?.msg || 'hcp volunteer experience deleted', 'error')
      })
      .catch((err) => {
        console.log(err);
      });
  },[getExperienceDetails,hcpId])

  const sortedExpData = CommonService.sortDatesByLatest(experiences, 'start_date')

  const openAdd = useCallback((id: any) => {
    setVExperience(id)
    setIsAddOpen(true);
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    handleDeleteClick(vExperienceId)
  }, [vExperienceId, handleDeleteClick])
  
  return (
    <div className="add-container">
       <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <VitawerksConfirmComponent cancel={cancelAdd} confirm={confirmAdd} text1='Want to delete' hcpname={'Volunteer Experience'} groupname={''} confirmationText={''} notext={"Back"} yestext={"Delete"} />
      </DialogComponent>
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
            {sortedExpData.map((experience: any, index: any) => (
              <ReadOnlyRow
                key={index}
                experience={experience}
                openAdd={openAdd}
              />
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
                    id="input_hcp_edit_Vexperience_name"
                  />

                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="location"
                    label="Location"
                    id="input_hcp_edit_Vexperience_location"
                  />
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="positionTitle"
                    label="Position Title"
                    id="input_hcp_edit_Vexperience_position"
                  />
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="speciality"
                    label="Speciality"
                    id="input_hcp_edit_Vexperience_speciality"
                  />

                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    fullWidth
                    name="skills"
                    label="Skills (Optional)"
                    id="input_hcp_edit_Vexperience_skills"
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
                    id="input_hcp_edit_Vexperience_working_here"

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
                      <MenuItem value={item.value} id={"menu_hcp_edit_Vexperience_" + index}>{item.label}</MenuItem>
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
                    label="Start Date"
                    id="input_hcp_edit_Vexperience_start_date"
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
                      InputLabelProps={{ shrink: true }}
                      id="input_hcp_edit_Vexperience_end_date"
                    />
                  }
                </div>

                <div className="hcp-common-btn-grp">
                  <Button
                    variant='outlined'
                    type="reset"
                    onClick={() => {
                      resetForm();
                      handleCancelExperience();
                    }}
                    id="btn_hcp_edit_Vexperience_cancel"
                  >
                    Delete
                  </Button>
                  <Button
                    color='primary'
                    variant='contained'
                    type="submit" id="btn_hcp_edit_Vexperience_submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="vol-add-action">
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
