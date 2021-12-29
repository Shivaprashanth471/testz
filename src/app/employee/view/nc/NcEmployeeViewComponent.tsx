import React from 'react';
import { Avatar } from '@material-ui/core';
import './NcEmployeeViewComponent.scss';
import HcpListComponent from './hcpList/HcpListComponent';

const NcEmployeeViewComponent = (props: any) => {
    const employeeDetails = props?.employeeDetails;
    return <div className="nc_employee_view screen crud-layout">
        <div className="custom-border pdd-0">
            <div className="d-flex pdd-top-20 pdd-bottom-0 pdd-left-30">
                <div className="pb-16 d-flex employee_details">
                    <div className="d-flex items-center ">
                        <Avatar alt="user photo" style={{ height: '80px', width: '80px' }}>{employeeDetails?.facility_name?.toUpperCase().charAt('0')}</Avatar>
                        <div className="mrg-left-20 items-center employee_name_role">
                            <h2>{employeeDetails?.first_name}&nbsp;{employeeDetails?.last_name}</h2>
                            <p>Nurse Champion</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex custom-border pdd-top-20 pdd-bottom-20 basic-details mrg-top-20">
                <div className="flex-1">
                    <h4>Contact Number</h4>
                    <p></p>
                </div>
                <div className="flex-1">
                    <h4>Address</h4>
                    <p></p>
                </div>
                <div className="flex-1">
                    <h4>Email</h4>
                    <p>{employeeDetails?.email}</p>
                </div>
                <div className="flex-1">
                    <h4>No. of HCP's</h4>
                    <p></p>
                </div>
            </div>
        </div>
        <div className="mrg-top-25">
            <HcpListComponent/>
        </div>

    </div>
}

export default NcEmployeeViewComponent;