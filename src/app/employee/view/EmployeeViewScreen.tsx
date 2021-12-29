import { Button, CircularProgress } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { ENV } from '../../../constants';
import { CommonService, Communications } from '../../../helpers';
import AmEmployeeViewComponent from './am/AmEmployeeViewComponent';
import './EmployeeViewScreen.scss';
import NcEmployeeViewComponent from './nc/NcEmployeeViewComponent';

const EmployeeViewScreen = () => {
    const [basicDetails, setBasicDetails] = useState<any | null>(null)
    const param = useParams<any>();
    const { id } = param;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'user/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        init()
        Communications.pageTitleSubject.next('Employee Mangement');
        Communications.pageBackButtonSubject.next("/employee/list");
    }, [init])

    return <div className="employee-view screen crud-layout">
        {isLoading && (
            <div className="view-loading-indicator">
                <CircularProgress color="secondary" className="loader" />
            </div>)}

            {!isLoading && (<div>
            <div className="d-flex edit-employee-wrapper">
                <div>
                    <Button variant={"contained"} color={"primary"} component={Link} to={`/employee/edit/` + id}>Edit Employee</Button>
                </div>
            </div>
            {
                basicDetails?.role ==="nurse_champion" ? <NcEmployeeViewComponent employeeDetails={basicDetails}/>:<AmEmployeeViewComponent employeeDetails={basicDetails}/>
            }
            </div>)}
    </div>;
}

export default EmployeeViewScreen;