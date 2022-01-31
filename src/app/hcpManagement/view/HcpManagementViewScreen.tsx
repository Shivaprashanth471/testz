// import HcpAssessmentRatingComponent from "./assessmentRatings/HcpAssessmentRatingComponent";
import { Button } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AccessControlComponent from "../../../components/AccessControl";
import DialogComponent from "../../../components/DialogComponent";
import LoaderComponent from "../../../components/LoaderComponent";
import { ENV } from "../../../constants";
import { Communications } from "../../../helpers";
import CommonService, { ADMIN, HUMANRESOURCE } from "../../../helpers/common-service";
import AssignToNcComponent from "../assignToNc/AssignToNcComponent";
import HcpDetailsComponent from "./details/HcpDetailsComponent";
import HcpEducationComponent from "./education/HcpEducationComponent";
import HcpExperienceComponent from "./experience/HcpExperienceComponent";
import "./HcpManagementViewScreen.scss";
import HcpReferenceComponent from "./reference/HcpReferenceComponent";
import RejectHcpComponent from "./rejectHcp/RejectHcpComponent";
import HcpVolunteerExperienceComponent from "./volunteerExperience/HcpVolunteerExperienceComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const HcpManagementViewScreen = () => {
  const classes = useStyles();
  const param = useParams<any>();
  const { id } = param;
  const [hcpBasicDetails, setBasicDetails] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [educationDetails, setEducationDetails] = useState<any | null>(null);
  const [volunteerExperience, setVolunteerExperience] = useState<any | null>(null);
  const [referenceDetails, setReferenceDetails] = useState<any | null>(null);
  const [experience, setExperienceDetails] = useState<any | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const init = useCallback(() => {
    // config
    CommonService._api
      .get(ENV.API_URL + "hcp/" + id)
      .then((resp) => {
        setBasicDetails(resp.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getEducationDetails = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "hcp/" + id + "/education")
      .then((resp) => {
        setEducationDetails(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getExperienceDetails = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "hcp/" + id + "/experience?exp_type=fulltime")
      .then((resp) => {
        setExperienceDetails(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getVolunteerExperienceDetails = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "hcp/" + id + "/experience?exp_type=volunteer")
      .then((resp) => {
        setVolunteerExperience(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const getReferenceDetails = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "hcp/" + id + "/reference")
      .then((resp) => {
        // console.log(resp);
        setReferenceDetails(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    init();
    getEducationDetails();
    getExperienceDetails();
    getVolunteerExperienceDetails();
    getReferenceDetails();
    Communications.pageTitleSubject.next("HCP Details");
    Communications.pageBackButtonSubject.next("/hcp/list");
  }, [init, getEducationDetails, getExperienceDetails, getVolunteerExperienceDetails, getReferenceDetails]);

  const openAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const confirmAdd = useCallback(() => {
    setIsAddOpen(false);
    init();
  }, [init]);

  const openRejectHcp = useCallback(() => {
    setIsRejectOpen(true);
  }, []);

  const cancelRejectHcp = useCallback(() => {
    setIsRejectOpen(false);
  }, []);

  const confirmRejectHcp = useCallback(() => {
    setIsRejectOpen(false);
    init();
  }, [init]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="pdd-30 screen crud-layout">
      {!isLoading && (
        <>
          <DialogComponent open={isAddOpen} cancel={cancelAdd}>
            <AssignToNcComponent cancel={cancelAdd} confirm={confirmAdd} />
          </DialogComponent>
          <DialogComponent open={isRejectOpen} cancel={cancelRejectHcp}>
            <RejectHcpComponent cancel={cancelRejectHcp} confirm={confirmRejectHcp} />
          </DialogComponent>
          <div className="hcp_view_details">
            <div className="d-flex profile-status-wrapper">
              <div>
                <Button variant={"contained"} color={"primary"} component={Link} to={`/hcp/edit/${id}`}>
                  Edit HCP
                </Button>
              </div>
            </div>
            <div className="mrg-top-15">
              <HcpDetailsComponent hcpBasicDetails={hcpBasicDetails} />
            </div>
            <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
              <Accordion expanded={expanded === "Education"} onChange={handleChange("Education")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                  <Typography className={classes.heading}>Education</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.root}>
                    <HcpEducationComponent educationDetails={educationDetails} />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
              <Accordion expanded={expanded === "Experience"} onChange={handleChange("Experience")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                  <Typography className={classes.heading}>Work Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.root}>
                    <HcpExperienceComponent experience={experience} />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
              <Accordion expanded={expanded === "Volunteer_Experience"} onChange={handleChange("Volunteer_Experience")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                  <Typography className={classes.heading}>Volunteer Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.root}>
                    <HcpVolunteerExperienceComponent volunteerExperience={volunteerExperience} />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
              <Accordion expanded={expanded === "Reference"} onChange={handleChange("Reference")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                  <Typography className={classes.heading}>Reference</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.root}>
                    <HcpReferenceComponent referenceDetails={referenceDetails} />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <div style={{ justifyContent: "center" }} className="mrg-top-50 d-flex button-wrapper">
              <AccessControlComponent role={[HUMANRESOURCE, ADMIN]}>
                {hcpBasicDetails?.status === "pending" ? (
                  <Button variant={"outlined"} onClick={openAdd} className="mrg-right-20">
                    Approve
                  </Button>
                ) : (
                  <></>
                )}
                {hcpBasicDetails?.status === "pending" ? (
                  <Button variant={"outlined"} className="mrg-right-20" onClick={openRejectHcp}>
                    Reject
                  </Button>
                ) : (
                  <></>
                )}
              </AccessControlComponent>
            </div>
          </div>
        </>
      )}
      <ScrollToTop smooth color="white" />
    </div>
  );
};

export default HcpManagementViewScreen;
