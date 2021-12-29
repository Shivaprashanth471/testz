import React from 'react';
import { Avatar } from '@material-ui/core';
import './AmEmployeeViewComponent.scss';

const AmEmployeeViewComponent = (props: any) => {
    const employeeDetails = props?.employeeDetails;
    return <div className="am_employee_view screen crud-layout">
        <div className="d-flex custom-border pdd-top-20 pdd-bottom-20">
            <div className="pb-16 d-flex employee_details">
                <div className="d-flex items-center ">
                    <Avatar alt="user photo" style={{ height: '80px', width: '80px' }}>{employeeDetails?.facility_name?.toUpperCase().charAt('0')}</Avatar>
                    <div className="mrg-left-20 items-center employee_name_role">
                        <h2>{employeeDetails?.first_name}&nbsp;{employeeDetails?.last_name}</h2>
                        <p>Account Manager</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="mrg-top-30 custom-border pdd-top-20 pdd-bottom-20 basic_details">
           <h3>Basic Details</h3>
           <div className="d-flex">
                <div className="flex-1">
                    <h4>First Name</h4>
                    <p>{employeeDetails?.first_name}</p>
                </div>
                <div className="flex-1">
                    <h4>Last Name</h4>
                    <p>{employeeDetails?.last_name}</p>
                </div>
           </div>
           <div className="d-flex mrg-top-20">
                <div className="flex-1">
                    <h4>Contact Number</h4>
                    <p>{employeeDetails?.contact_number}</p>
                </div>
                <div className="flex-1">
                    <h4>Email</h4>
                    <p>{employeeDetails?.email}</p>
                </div>
           </div>
           <div className="d-flex mrg-top-20">
                <div className="flex-1">
                    <h4>Address Line 1</h4>
                    <p>{employeeDetails?.contact_number}</p>
                </div>
           </div>
           <div className="d-flex mrg-top-20">
                <div className="flex-1">
                    <h4>Address Line 2</h4>
                    <p>{employeeDetails?.contact_number}</p>
                </div>
           </div>
           <div className="d-flex mrg-top-20">
           <div className="flex-1">
                    <h4>Country</h4>
                    <p>{employeeDetails?.contact_number}</p>
                </div>
                <div className="flex-1">
                    <h4>State</h4>
                    <p>{employeeDetails?.email}</p>
                </div>
           </div>
           <div className="d-flex mrg-top-20">
                <div className="flex-1">
                    <h4>Zip Code</h4>
                    <p>{employeeDetails?.contact_number}</p>
                </div>
           </div>
        </div>
    </div>;
}

export default AmEmployeeViewComponent;