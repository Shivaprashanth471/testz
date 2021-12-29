// import React, { useCallback, useEffect, useState } from 'react';
// import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../classes/ts-data-list-wrapper.class';
// import { ENV } from '../../../constants';
// import { ApiService, Communications } from '../../../helpers';
import './CreateShiftScreen.scss';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import Paper from '@material-ui/core/Paper';
// import TableCell from '@material-ui/core/TableCell';
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import { LinearProgress } from "@material-ui/core";
// import { Link } from "react-router-dom";

const CreateShiftScreen = () => {
    return <div className="shift-completed-view screen crud-layout pdd-30">
        <div className="facility-details">
            <h2>Glendale Transitional Care Center</h2>
            <p>1509 Wilison Terrac North Tower, 2nd Floor, Glendaale,CA 91206.</p>
        </div>
        <div className="facility-details mrg-top-40">
            <div className="d-flex shift-name-requested">
                <h2>Shift Details</h2>
                <div className="d-flex requested-on-wrapper">
                    <h3>Requested On:</h3>
                    <p className="mrg-left-10">29-09-2021</p>
                </div>
            </div>
            <p>1509 Wilison Terrac North Tower, 2nd Floor, Glendaale,CA 91206.</p>
            <div className="d-flex shift-details">
                <div className="flex-1">
                    <h3>Required From:</h3>
                    <p>20-08-2021</p>
                </div>
                <div className="flex-1">
                    <h3>Required To:</h3>
                    <p>20-08-2021</p>
                </div>
                <div className="flex-1">
                    <h3>Time</h3>
                    <p>11 PM- 3AM</p>
                </div>
                <div className="flex-1">
                    <h3>Time Type:</h3>
                    <p>NOC</p>
                </div>
            </div>
            <div className="d-flex shift-details">
                <div className="flex-1">
                    <h3>HCP Type</h3>
                    <p>CNA</p>
                </div>
                <div className="flex-1">
                    <h3>Warning Zone</h3>
                    <p>RED</p>
                </div>
                <div className="flex-1">
                </div>
                <div className="flex-1">
                </div>
            </div>
        </div>

    </div>;
}



export default CreateShiftScreen;