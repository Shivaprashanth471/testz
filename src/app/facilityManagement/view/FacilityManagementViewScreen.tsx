import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {  useParams } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import LoaderComponent from '../../../components/LoaderComponent';
import NoDataToShowCardComponent from '../../../components/NoDataToShowCardComponent';
import { ENV } from '../../../constants';
import { CommonService, Communications } from '../../../helpers';
import FacilityBasicDetailsComponent from './basicDetails/FacilityBasicDetailsComponent';
import './FacilityManagementViewScreen.scss';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const FacilityManagementViewScreen = (props:any) => {
    const classes = useStyles();
    let history = useHistory();
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [facilityDetails, setFacilityDetails] = useState<any | null>(null);
    const [facilityMembers, setFacilityMembers] = useState<any | null>(null);
    const [shiftDetails, setShiftDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'facility/' + id).then((resp) => {
            setFacilityDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const getShiftDetails = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'facility/' + id + '/shift').then((resp) => {
            // console.log(resp);
            setShiftDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const getFacilityMembers = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'facility/' + id + '/member').then((resp) => {
            // console.log(resp);
            setFacilityMembers(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

  const getFacilityMembers = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "facility/" + id + "/member")
      .then((resp) => {
        // console.log(resp);
        setFacilityMembers(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  

    if (isLoading) {
        return <LoaderComponent />
    }

  useEffect(() => {
    let prevLocation:any="/facility/list";
    if(props?.location.state){
        prevLocation=props?.location.state?.prevPath;
    }
    init();
    getFacilityMembers();
    getShiftDetails();
    Communications.pageTitleSubject.next('Facility Details');
    Communications.pageBackButtonSubject.next(prevLocation);
}, [init, getFacilityMembers, getShiftDetails, id,history,props?.location.state])


    return <div className="pdd-30 screen">
        {!isLoading && (<div className="facility_view_details">
            <FacilityBasicDetailsComponent facilityDetails={facilityDetails} />
            <div className="basic_details custom-border mrg-top-10">
                <Accordion expanded={expanded === 'Facility_Members'} onChange={handleChange('Facility_Members')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>Facility Members</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.root}>
                            {
                                facilityMembers?.length > 0 ? facilityMembers?.map((item: any, index: any) => {
                                    return (<div className={index !== 0 ? "mrg-top-30" : "mrg-top-10"}>
                                        <h4 className="title-count mrg-top-0">Facility Member {index + 1}</h4>
                                        <div>
                                            <div className="d-flex">
                                                <div className="flex-1">
                                                    <h4>Facility Manager Name</h4>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <h4>Email</h4>
                                                    <p>{item.email}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <h4>Contact Number</h4>
                                                    <p>{item.phone_number}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="flex-1">
                                                    <h4>Extension Number</h4>
                                                    <p>{item.extension_number ? item.extension_number : "N/A"}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <h4>Designation</h4>
                                                    <p>{item.designation}</p>
                                                </div>
                                                <div className="flex-1"></div>
                                            </div>
                                        </div>
                                    </div>)
                                }) : <NoDataToShowCardComponent />
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="basic_details custom-border mrg-top-10">
                <Accordion expanded={expanded === 'Shift_Details'} onChange={handleChange('Shift_Details')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>Shift Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.root}>
                            {
                                shiftDetails?.length > 0 ? shiftDetails?.map((item: any, index: any) => {
                                    const start_time_to_show = moment(CommonService.convertMinsToHrsMins(item?.shift_start_time), 'hh:mm').format('LT')
                                    const end_time_to_show = moment(CommonService.convertMinsToHrsMins(item?.shift_end_time), 'hh:mm').format('LT');

                                    let start_time_to_cal = CommonService.convertMinsToHrsMins(item.shift_start_time)
                                    let end_time_to_cal = CommonService.convertMinsToHrsMins(item.shift_end_time)

                                    const start_time_to_get_duration = moment().startOf('day').add(item.shift_start_time, 'minutes');
                                    let end_time_to_get_duration = moment().startOf('day').add(item.shift_end_time, 'minutes');
                                    if (start_time_to_cal > end_time_to_cal) {
                                        end_time_to_get_duration = moment(end_time_to_get_duration).add(1, 'day')
                                    }
                                    return (<div className={index !== 0 ? "mrg-top-30" : "mrg-top-10"}>
                                        <h4 className="title-count mrg-top-0">Shift Details {index + 1}</h4>
                                        <div className="">
                                            <div className="d-flex">
                                                <div className="flex-1">
                                                    <h4>Shift Start Time</h4>
                                                    <p>{start_time_to_show}</p>

                                                </div>
                                                <div className="flex-1">
                                                    <h4>Shift End Time</h4>
                                                    <p>{end_time_to_show}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <h4>Shift Duration</h4>
                                                    <p>{CommonService.durationBetweenTimeStamps(
                                                        start_time_to_get_duration,
                                                        end_time_to_get_duration
                                                    )}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="flex-1">
                                                    <h4>Shift Type</h4>
                                                    <p>{item.shift_type}</p>
                                                </div>
                                                <div className="flex-1"></div>
                                            </div>
                                        </div>
                                    </div>)
                                }) : <NoDataToShowCardComponent />
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>)}
        <ScrollToTop smooth color="white" />
    </div>
}


export default FacilityManagementViewScreen;
