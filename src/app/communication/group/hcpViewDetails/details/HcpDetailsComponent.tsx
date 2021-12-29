import React, { useCallback, useEffect, useState } from 'react';
import "./HcpDetailsComponent.scss";
// import CustomFile from '../../../../components/shared/CustomFile';
import { CommonService } from '../../../../../helpers';
import { ENV } from '../../../../../constants';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import CustomFile from '../../../../../components/shared/CustomFile';
import HcpContractComponent from '../contract/HcpContractComponent';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import HcpEducationComponent from '../education/HcpEducationComponent';
import HcpExperienceComponent from '../experience/HcpExperienceComponent';
import HcpVolunteerExperienceComponent from '../volunteerExperience/HcpVolunteerExperienceComponent';
import HcpReferenceComponent from '../reference/HcpReferenceComponent';
import { CircularProgress } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const HcpDetailsComponent = (props: any) => {
    const classes = useStyles();
    const params = useParams<{ id: string }>();
    const { id } = params
    const { setIsAttachmentsLoading } = props
    const [hcpBasicDetails, setBasicDetails] = useState<any | null>(null)
    const [educationDetails, setEducationDetails] = useState<any | null>(null)
    const [volunteerExperience, setVolunteerExperience] = useState<any | null>(null);
    const [referenceDetails, setReferenceDetails] = useState<any | null>(null);
    const [experience, setExperienceDetails] = useState<any | null>(null);
    const [attachmentsDetails, setAttachmentsDetails] = useState<any | null>(null);
    const [sortedAttachments, setSortedAttachments] = useState<any | null>(null);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [attachmentLoading, setAttachmentLoading] = useState<boolean>(false)

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const getAttachmentsDetails = useCallback((hcp_id) => {
        setAttachmentLoading(true)
        CommonService._api.get(ENV.API_URL + 'hcp/' + hcp_id + '/attachments').then((resp) => {
            setAttachmentsDetails(resp?.data);
            setIsAttachmentsLoading(false)
            setAttachmentLoading(false)
        }).catch((err) => {
            console.log(err)
            setIsAttachmentsLoading(false)
            setAttachmentLoading(false)
        })
    }, [setIsAttachmentsLoading, setAttachmentLoading])

    const getEducationDetails = useCallback((hcp_id) => {
        CommonService._api.get(ENV.API_URL + 'hcp/' + hcp_id + '/education').then((resp) => {
            // console.log(resp);
            setEducationDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [])


    const getExperienceDetails = useCallback((hcp_id) => {
        CommonService._api.get(ENV.API_URL + 'hcp/' + hcp_id + '/experience?exp_type=fulltime').then((resp) => {
            // console.log(resp);
            setExperienceDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const getVolunteerExperienceDetails = useCallback((hcp_id) => {
        CommonService._api.get(ENV.API_URL + 'hcp/' + hcp_id + '/experience?exp_type=volunteer').then((resp) => {
            // console.log(resp);
            setVolunteerExperience(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const getReferenceDetails = useCallback((hcp_id) => {
        CommonService._api.get(ENV.API_URL + 'hcp/' + hcp_id + '/reference').then((resp) => {
            // console.log(resp);
            setReferenceDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'hcp/user/' + id).then((resp) => {
            setBasicDetails(resp.data);
            getEducationDetails(resp.data?._id);
            getExperienceDetails(resp.data?._id);
            getVolunteerExperienceDetails(resp.data?._id);
            getReferenceDetails(resp.data?._id)
            getAttachmentsDetails(resp.data?._id)
        }).catch((err) => {
            console.log(err)
        })
    }, [id, getEducationDetails, getExperienceDetails, getVolunteerExperienceDetails, getReferenceDetails, getAttachmentsDetails])

    useEffect(() => {
        init();
    }, [init])

    useEffect(() => {
        const required_attachments = [{ name: "Physical Test", index: -1 }, { name: "Covid Certificate", index: -1 }, { name: "TB Test", index: -1 }, { name: "Chest X-ray", index: -1 }, { name: "CPR/BLS Card", index: -1 }, { name: "Driver's Licence", index: -1 }, { name: "SSN Card", index: -1 }, { name: "License", index: -1 }, { name: "Covid Vaccine Card", index: -1 }, { name: "Covid Test Result", index: -1 }, { name: "Livescan", index: -1 }, { name: "Vaccine Exemption Letter", index: -1 }]
        let tempAttachemnts: any = []
        required_attachments?.forEach((item: any) => {
            attachmentsDetails?.forEach((attachment: any) => {
                if (item.name === attachment?.attachment_type) {
                    tempAttachemnts.push(attachment)
                }
            })
        })

        setSortedAttachments([...tempAttachemnts])
    }, [attachmentsDetails])

    const StyledLoader = () => {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress color="secondary" />
        </div>
    }

    return <div className="hcp_details">
        <div className="custom-border pdd-20 pdd-left-40 pdd-right-40">
            <h3>Basic Details</h3>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>First Name</h4>
                    <p>{hcpBasicDetails?.first_name} </p>
                </div>
                <div className="flex-1">
                    <h4>Last Name</h4>
                    <p>{hcpBasicDetails?.last_name} </p>
                </div>
                <div className="flex-1">
                    <h4>Contact Number</h4>
                    <p>{hcpBasicDetails?.contact_number}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Email</h4>
                    <p>{hcpBasicDetails?.email}</p>
                </div>
                <div className="flex-1">
                    <h4>Gender</h4>
                    <p>{hcpBasicDetails?.gender}</p>
                </div>
                <div className="flex-1">
                    <h4>Role</h4>
                    <p>{hcpBasicDetails?.hcp_type}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Region Name</h4>
                    <p>{hcpBasicDetails?.address?.region}</p>
                </div>
                <div className="flex-1">
                    <h4>Street</h4>
                    <p>{hcpBasicDetails?.address?.street}</p>
                </div>
                <div className="flex-1">
                    <h4>City</h4>
                    <p>{hcpBasicDetails?.address?.city}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>State</h4>
                    <p>{hcpBasicDetails?.address?.state}</p>
                </div>
                <div className="flex-1">
                    <h4>Country</h4>
                    <p>{hcpBasicDetails?.address?.country}</p>
                </div>
                <div className="flex-1">
                    <h4>Zip Code</h4>
                    <p>{hcpBasicDetails?.address?.zip_code}</p>
                </div>
            </div>
            <div className="mrg-top-10">
                <h4>About the HCP</h4>
                <p className="summary">{hcpBasicDetails?.about}</p>
            </div>
        </div>
        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
            <h3>Professional Details</h3>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Years of Experience</h4>
                    <p>{hcpBasicDetails?.professional_details?.experience}</p>
                </div>
                <div className="flex-1">
                    <h4>Speciality</h4>
                    <p>{hcpBasicDetails?.professional_details?.speciality}</p>
                </div>
            </div>
            <div>
                <h4>Professional Summary</h4>
                <p className="summary">{hcpBasicDetails?.professional_details?.summary}</p>
            </div>
        </div>

        {!attachmentLoading && sortedAttachments ?
            <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
                <h3>Attachments</h3>
                {
                    sortedAttachments?.length === 0 && <p> - </p>
                }
                <div className="attachments_wrapper">
                    {sortedAttachments?.map((item: any) => {
                        return (
                            <div className="attachments"><CustomFile data={item} /></div>
                        )
                    })}

                </div>
            </div> : <div className='custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40 '>
                <StyledLoader />
            </div>}

        <div>
            <HcpContractComponent id={hcpBasicDetails?._id} />
        </div>

        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40 pdd-bottom-35">
            <h3>NC Section</h3>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>DNR</h4>
                    <p>{hcpBasicDetails?.nc_details?.dnr}</p>
                </div>
                <div className="flex-1">
                    <h4>Vaccine</h4>
                    <p>{hcpBasicDetails?.nc_details?.vaccine === "half" ? "1st Dose" : hcpBasicDetails?.nc_details?.vaccine}</p>
                </div>

                <div className="flex-1">
                    <h4>Preferred Location to Work</h4>
                    <p>{hcpBasicDetails?.nc_details?.location_preference}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Contact Type</h4>
                    <p>{hcpBasicDetails?.nc_details?.contact_type}</p>
                </div>

                <div className="flex-1">
                    <h4>Preference Shift Type</h4>
                    <p>{hcpBasicDetails?.nc_details?.shift_type_preference}</p>
                </div>

                <div className="flex-1">
                    <h4>Covid (or) Non Covid Facility ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.covid_facility_preference}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Zone Assignment</h4>
                    <p>{hcpBasicDetails?.nc_details?.zone_assignment !== "" ? hcpBasicDetails?.nc_details?.zone_assignment:"N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Do you have a Full-time Job ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_fulltime_job !== "" ? hcpBasicDetails?.nc_details?.is_fulltime_job === true ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>What Is More Important for You ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.more_important_preference !== "" ? hcpBasicDetails?.nc_details?.more_important_preference:"N/A"}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Is this a Supplement to your Income ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_supplement_to_income !== "" ? hcpBasicDetails?.nc_details?.is_supplement_to_income === true ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Are you Studying ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_studying !== "" ? hcpBasicDetails?.nc_details?.is_studying === true ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Gusto</h4>
                    <p>{hcpBasicDetails?.nc_details?.gusto_type !== "" ? hcpBasicDetails?.nc_details?.gusto_type : "N/A"}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Is Gusto Invited ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_gusto_invited !== "" ? hcpBasicDetails?.nc_details?.is_gusto_invited === true ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Is Gusto Onboarded ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_gusto_onboarded !== "" ? hcpBasicDetails?.nc_details?.is_gusto_onboarded === true ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Last Call Date</h4>
                    <p>{hcpBasicDetails?.nc_details?.last_call_date ? moment(hcpBasicDetails?.nc_details?.last_call_date).format('MMMM Do YYYY, hh:mm A') : "N/A"}</p>
                </div>

            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Family Considerations</h4>
                    <p>{hcpBasicDetails?.nc_details?.family_consideration}</p>
                </div>
                <div className="flex-1">
                    <h4>Other Information Gathered</h4>
                    <p>{hcpBasicDetails?.nc_details?.other_information}</p>
                </div>
                <div className="flex-1">
                </div>
            </div>
        </div>
        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
            <Accordion expanded={expanded === 'Education'} onChange={handleChange('Education')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Education</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        <HcpEducationComponent educationDetails={educationDetails} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
            <Accordion expanded={expanded === 'Experience'} onChange={handleChange('Experience')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Work Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        <HcpExperienceComponent experience={experience} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
            <Accordion expanded={expanded === 'Volunteer_Experience'} onChange={handleChange('Volunteer_Experience')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Volunteer Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        <HcpVolunteerExperienceComponent volunteerExperience={volunteerExperience} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
        <div className="custom-border mrg-top-40 pdd-20 pdd-left-40 pdd-right-40">
            <Accordion expanded={expanded === 'Reference'} onChange={handleChange('Reference')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Reference</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.root}>
                        <HcpReferenceComponent referenceDetails={referenceDetails} />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    </div>

}

export default HcpDetailsComponent;