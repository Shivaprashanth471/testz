import { Button, TextField } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from "@material-ui/core/Paper";
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import { AddRounded, SearchRounded } from "@material-ui/icons";
import ClearIcon from '@material-ui/icons/Clear';
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    TsDataListOptions,
    TsDataListState,
    TsDataListWrapperClass
} from "../../../classes/ts-data-list-wrapper.class";
import AccessControlComponent from "../../../components/AccessControl";
import LoaderComponent from "../../../components/LoaderComponent";
import NoDataCardComponent from "../../../components/NoDataCardComponent";
import { useLocalStorage } from "../../../components/useLocalStorage";
import { ENV } from "../../../constants";
import { ApiService, Communications } from "../../../helpers";
import CommonService, { ACCOUNTMANAGER, ADMIN } from "../../../helpers/common-service";
import { StateParams } from "../../../store/reducers";
import FacilityFiltersComponent from "../filters/FacilityFiltersComponent";
import './FacilityManagementListScreen.scss';

const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#10c4d3',
            },
        },
    },
})(TextField);

const FacilityManagementListScreen = () => {

    const [list, setList] = useState<TsDataListState | null>(null);
    const {role} = useSelector((state: StateParams) => state?.auth?.user);
    const [regionList, setRegionList] = useState<any | null>(null);

    const [selectedRegions, setSelectedRegions] = useLocalStorage<any>('facilityRegions', [])
    const [status, setStatus] = useLocalStorage<any>('facilityStatus', "");
    const [dateRange, setDateRange] = useLocalStorage('facilityDateRange', [null, null]);


    const classesFunction = useCallback((type: any) => {
        if (type === "Actions") {
            return "text-right last-row"
        } else if (type === 'Active / Inactive') {
            return 'text-align'
        } else if (type === "Created On") {
            return 'pdd-left-20 first-row'
        }
    }, [])


    const onReload = useCallback((page = 1) => {
        if (list) {
            list.table.reload(page);
        } else {
            setList(prevState => {
                prevState?.table.reload(page);
                return prevState;
            })
        }
    }, [list]);


    const getRegions = useCallback(() => {
        CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
            setRegionList(resp.data || []);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const init = useCallback(() => {

        let url = "facility/list";
        let payload: any = {};

        if (selectedRegions.length > 0) {
            payload.regions = selectedRegions.map((item: any) => item?.name);
        }

        if (status !== "") {
            payload.is_active = status?.code;
        }

        if (dateRange[0] || dateRange[1]) {
            let startDate = moment(dateRange[0]).format('YYYY-MM-DD');
            let endDate = moment(dateRange[1]).format('YYYY-MM-DD');

            if (!dateRange[1]) {
                payload.start_date = startDate
                payload.end_date = startDate
            } else {
                payload.start_date = startDate
                payload.end_date = endDate
            }
        }

        const options = new TsDataListOptions({
            extraPayload: payload,
            webMatColumns: role === "super_admin" ?
                ['Created On', "Facility Name", "Region", "Contact Number", 'Active / Inactive', "Actions"] : ['Created On', "Facility Name", "Region", "Contact Number", 'Status', "Actions"],
            mobileMatColumns: role === "super_admin" ? ['Created On', "Facility Name", "Region", "Contact Number", 'Active / Inactive', "Actions"] :
                ['Created On', "Facility Name", "Region", "Contact Number", 'Status', "Actions"],
        },
            ENV.API_URL + url, setList, ApiService, "post");
        let tableWrapperObj = new TsDataListWrapperClass(options);
        setList({table: tableWrapperObj});
    }, []);

    const getList = useCallback(() => {

        if (!list) {
            init();
            return;
        }

        let payload: any = {}

        if (selectedRegions.length > 0) {
            payload.regions = selectedRegions.map((item: any) => item?.name)
        }

        if (status !== "") {
            payload.is_active = status?.code
        }

        if (dateRange[0] || dateRange[1]) {
            let startDate = moment(dateRange[0]).format('YYYY-MM-DD')
            let endDate = moment(dateRange[1]).format('YYYY-MM-DD')

            if (!dateRange[1]) {
                payload.start_date = startDate
                payload.end_date = startDate
            } else {
                payload.start_date = startDate
                payload.end_date = endDate
            }
        }
        setList( (list)=>{
            list?.table?.setExtraPayload(payload);
            list?.table.getList(1);
            return list
        });
    }, [role, selectedRegions, status, dateRange]);

    const clearFilterValues = () => {
        setDateRange([null, null])
        setStatus('')
        selectedRegions.length = 0
    }

    const resetFilters = () => {
        clearFilterValues()
    }

    const handletoggleStatus = useCallback((id: any, is_active) => {
        let payload = {
            is_active: !is_active
        }
        CommonService._api.put(ENV.API_URL + 'facility/' + id, payload).then((resp) => {
            onReload()
        }).catch((err) => {
            console.log(err)
        })
    }, [onReload])

    useEffect(() => {
        getRegions();
        Communications.pageTitleSubject.next("Facility Management");
        Communications.pageBackButtonSubject.next(null);
    }, [getRegions]);

    useEffect(() => {
        getList();
    }, [getList]);


    return (
        <>
            <div className={"facility-list screen crud-layout pdd-30 pdd-top-10"}>
                {list && list.table?._isDataLoading && (
                    <div className="table-loading-indicator">
                        <LoaderComponent/>
                    </div>
                )}

                <FacilityFiltersComponent
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    selectedRegions={selectedRegions}
                    setSelectedRegions={setSelectedRegions}
                    resetFilters={resetFilters}
                    setStatus={setStatus}
                    regionList={regionList}
                    status={status}
                />

                <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0">
                    <div className="header">
                        <div className="mrg-left-5 filter">
                            <div>
                                <div className="d-flex">
                                    <div className="d-flex position-relative">
                                        {!list?.table.filter.search ?
                                            <div className={"search_icon"}>
                                                <SearchRounded/>
                                            </div> : <div className={"search_icon"}><ClearIcon onClick={event => {
                                                if (list && list.table) {
                                                    list.table.filter.search = '';
                                                    list.table.reload();
                                                    // list?.table.pageEvent(0)
                                                }

                                            }} id="clear_facility_search"/></div>}
                                        <div>
                                            <CssTextField defaultValue={''} className="search-cursor searchField"
                                                          id="input_search_facility" onChange={event => {
                                                if (list && list.table) {
                                                    list.table.filter.search = event.target.value;
                                                    list.table.reload();
                                                    // list?.table.pageEvent(0)
                                                }

                                            }} value={list?.table.filter.search} variant={"outlined"} size={"small"}
                                                          type={'text'} placeholder={('Search Facility')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="action pdd-right-5 d-flex">
                            <div className="mrg-left-20">
                                <AccessControlComponent role={[ACCOUNTMANAGER, ADMIN]}>
                                    <Tooltip title="Add New Facility">
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            component={Link}
                                            to={`/facility/add`}
                                        >
                                            <AddRounded />
                                            &nbsp;&nbsp;Add Facility&nbsp;&nbsp;
                                        </Button>
                                    </Tooltip>
                                </AccessControlComponent>
                            </div>
                        </div>
                    </div>
                    {list && list.table && (
                        <>
                            <TableContainer component={Paper} className={"table-responsive"}>
                                <Table stickyHeader aria-label="sticky table" className="table">
                                    <TableHead>
                                        <TableRow>
                                            {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                                    <TableCell
                                                        className={classesFunction(column)}
                                                        key={"header-col-" + columnIndex}
                                                    >
                                                        {column}
                                                    </TableCell>
                                                )
                                            )}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {!list.table._isDataLoading && list.table?.data.length === 0 &&
                                            <NoDataCardComponent tableCellCount={list.table.matColumns.length}/>
                                        }

                                        {list?.table.data.map((row: any, rowIndex: any) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={"row-" + rowIndex}>
                                                    <TableCell className="pdd-left-20">
                                                        {moment(row['created_at']).format("MM-DD-YYYY")}
                                                    </TableCell>
                                                    <TableCell>{row["facility_name"]}</TableCell>
                                                    <TableCell>{row?.address["region_name"]}</TableCell>
                                                    <TableCell>{row["phone_number"]}</TableCell>
                                                    {
                                                        role === "super_admin" ?
                                                            <TableCell style={{textAlign: "center"}}> <FormControlLabel
                                                                control={<Switch checked={row['is_active']}
                                                                                 onChange={() => handletoggleStatus(row['_id'], row['is_active'])}/>}
                                                                label={''}
                                                            /> </TableCell> :
                                                            <TableCell>{row['is_active'] ? 'Active' : 'Inactive'}</TableCell>
                                                    }
                                                    <TableCell className="text-right mrg-right-10 position-sticky">
                                                        <Link
                                                            to={"/facility/tabs/" + row?._id}
                                                            className="info-link "
                                                            id={"link_facility_details" + rowIndex}
                                                        >
                                                            {"View Details"}
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={list.table.pagination.pageSizeOptions}
                                    component='div'
                                    count={list?.table.pagination.totalItems}
                                    rowsPerPage={list?.table.pagination.pageSize}
                                    page={list?.table.pagination.pageIndex}
                                    onPageChange={(event, page) => list.table.pageEvent(page)}
                                    onRowsPerPageChange={event => list.table?.pageEvent(0, +event.target.value)}
                                />
                            </TableContainer>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};


export default FacilityManagementListScreen;
