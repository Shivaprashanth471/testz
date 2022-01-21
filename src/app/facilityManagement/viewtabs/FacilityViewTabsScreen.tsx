import { Avatar, Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ComingSoonComponent from '../../../components/ComingSoonComponent';
import LoaderComponent from '../../../components/LoaderComponent';
import { ENV } from '../../../constants';
import { CommonService, Communications } from '../../../helpers';
//import FacilityActivityComponent from './activity/FacilityActivityComponent';
import './FacilityViewTabsScreen.scss';
// import FacilityHcpListComponent from './hcps/FacilityHcpListComponent';
// import FacilityNotesListComponent from './notes/list/FacilityNotesListComponent';
// import FacilityShiftsListComponent from './shifts/FacilityShiftsListComponent';
// import FacilityTaskListComponent from './task/list/FacilityTaskListComponent';

const FacilityViewTabsScreen = () => {
    const params = useParams<any>()
    const { id } = params;
    // const [tabValue, setTabValue] = useState(0);
    // const handleTabChange = (event: any, value: any) => {
    //     setTabValue(value);
    // }

    const [facilityDetails, setFacilityDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const init = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'facility/' + id).then((resp) => {
            setFacilityDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        init();
        Communications.pageTitleSubject.next('Facility Details');
        Communications.pageBackButtonSubject.next("/facility/list");
    }, [init])

    if (isLoading) {
        return <LoaderComponent />
    }

    return <div className="pdd-30 screen">
        {!isLoading && (<>
            <div className="facility_view_tabs_details  ">
                <div className="facility_name d-flex">
                    <div className="pb-16 d-flex facility_details">
                        <div className="d-flex items-center ">
                            {
                                facilityDetails?.image_url ? <Avatar alt="user photo" style={{ height: '80px', width: '80px' }} src={facilityDetails?.image_url}></Avatar> :
                                    <Avatar alt="user photo" style={{ height: '80px', width: '80px' }}>{facilityDetails?.facility_name?.toUpperCase().charAt('0')}</Avatar>
                            }
                            <div className="mrg-left-20 items-center">
                                <h2 className='mrg-top-15'>{facilityDetails?.facility_name}</h2>
                                <div className="d-flex items-center location pdd-0">
                                    <p className="location_name">{facilityDetails?.address?.region_name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="actions-wrapper">
                            <Button
                                component={Link}
                                color={"primary"}
                                variant={"outlined"}
                                to={"/facility/view/" + id}
                            >
                                View  Details
                            </Button>
                        </div>

                    </div>
                </div>
                <div className="">
                    <ComingSoonComponent />
                    {/* <div className="tabs_header">

                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            scrollButtons="auto"
                        >
                            <Tab label="Activity" />
                            <Tab label="Shifts" />
                            <Tab label="HCP" />
                            <Tab label="Task" />
                            <Tab label="Notes" />
                            <Tab label="Reviews" />
                        </Tabs>

                    </div> */}

                    {/* <div>

                        <div className={tabValue !== 0 ? 'hidden' : ''}>
                            <FacilityActivityComponent />
                        </div>

                        <div className={tabValue !== 1 ? 'hidden' : ''}>
                            <FacilityShiftsListComponent />

                        </div>
                        <div className={tabValue !== 2 ? 'hidden' : ''}>
                            <FacilityHcpListComponent />

                        </div>
                        <div className={tabValue !== 3 ? 'hidden' : ''}>
                            <FacilityTaskListComponent />

                        </div>
                        <div className={tabValue !== 4 ? 'hidden' : ''}>
                            <FacilityNotesListComponent />

                        </div>

                    </div> */}
                </div>

            </div>
        </>)}
    </div>
}


export default FacilityViewTabsScreen;
