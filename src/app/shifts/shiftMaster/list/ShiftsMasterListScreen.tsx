import { LinearProgress, TextField } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { SearchRounded } from "@material-ui/icons";
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
import FilterListIcon from '@material-ui/icons/FilterList';
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import { ENV } from '../../../../constants';
import { ApiService, CommonService, Communications } from '../../../../helpers';
import './ShiftsMasterListScreen.scss';
import DialogComponent from "../../../../components/DialogComponent";
import ShiftFilter from "../../filters/ShiftFilter";
import {withStyles} from '@material-ui/core/styles';

const CssTextField = withStyles({
  root: {
     '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
           borderColor: '#10c4d3',
        },
     },
  },
})(TextField);


const ShiftsMasterListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [facilityList, setFacilityList] = useState<any | null>(null);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const facilityIdRef = useRef<any>('')
    const hcpTypeRef = useRef<any>('')
    const statusRef = useRef<any>('')
    const valueRef = useRef<any>(null)
    const timeTypeRef = useRef<any>('')
    const [regions, setRegions] = useState<any>([])
    const [selectedRegion, setSelectedRegion] = useState<string>('')

    const [selectedHcps, setSelectedHcps] = useState<any>([])
    const [selectedFacilities, setSelectedFacilities] = useState<any>([])
    const [selectedTimeTypes, setSelectedTimeTypes] = useState<any>([])
    const [selectedStatusTypes, setSelectedStatusTypes] = useState<any>([])
    const [selectedDates, setSelectedDates] = useState<any>(null);



    const setFacilityIdRef = (val: any) => {
        facilityIdRef.current = val;
    }
    const setHcpTypeRef = (val: any) => {
        hcpTypeRef.current = val;
    }
    const setStatusRef = (val: any) => {
        statusRef.current = val;
    }
    const setValueRef = (val: any) => {
        valueRef.current = val;
    }
    const setTimeTypeRef = (val: any) => {
        timeTypeRef.current = val;
    }

    const getRegions = useCallback(() => {
        CommonService._api
            .get(ENV.API_URL + "meta/hcp-regions")
            .then((resp) => {
                setRegions(resp.data || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const getHcpTypes = useCallback(() => {
        CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
            setHcpTypes(resp.data || []);
        }).catch((err) => {
            console.log(err);
        });
    }, []);


    const getFacilityData = useCallback(() => {
        let payload: any = {}
        if (selectedRegion !== "") {
            payload.regions = [selectedRegion]
        }
        ApiService.post(ENV.API_URL + "facility/lite", payload)
            .then((res) => {
                setFacilityList(res?.data || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [selectedRegion]);


    const init = useCallback(() => {
        let url = "shift"
        let payload: any = {}

        if (selectedFacilities.length > 0) {
            payload.facilities = selectedFacilities.map((item: any) => item?._id)
        }

        if (selectedHcps.length > 0) {
            payload.hcp_types = selectedHcps
        }

        if (selectedStatusTypes.length > 0) {
            payload.status = selectedStatusTypes
        }

        if (selectedDates instanceof Array) {
            if (selectedDates[1]) {
                payload.start_date = selectedDates[0]; payload.end_date = selectedDates[1]
            } else {
                payload.start_date = selectedDates[0]; payload.end_date = selectedDates[0]
            }
        }

        if (selectedTimeTypes.length > 0) {
            payload.shift_types = selectedTimeTypes
        }

        const options = new TsDataListOptions({
            extraPayload: payload,
            webMatColumns: ['Title', 'Facility Name', 'Shift Date', 'HCP Name', 'HCP Type', 'Time Type', 'Status', 'Action'],
            mobileMatColumns: ['Title', 'Facility Name', 'Shift Date', 'HCP Name', 'HCP Type', 'Time Type', 'Status', 'Action'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });

    }, [selectedStatusTypes, selectedTimeTypes, selectedHcps, selectedFacilities, selectedDates])

    const clearFilterValues = () => {
        facilityIdRef.current = ""
        hcpTypeRef.current = ""
        statusRef.current = ""
        valueRef.current = null
        timeTypeRef.current = ""

        setSelectedTimeTypes([])
        setSelectedFacilities([])
        setSelectedHcps([])
        setSelectedStatusTypes([])
        setSelectedDates([])
    }

    const openFilters = useCallback((index: any) => {
        clearFilterValues()
        setOpen(true)
    }, [])

    const cancelopenFilters = useCallback(() => {
        setOpen(false)
    }, [])
    const confirmopenFilters = useCallback(() => {
        init()
        setOpen(false)
    }, [init])

    const resetFilters = useCallback(() => {
        clearFilterValues()
        init()
    }, [init])

    useEffect(() => {
        init()
        getRegions()
        getHcpTypes()
        getFacilityData()
        Communications.pageTitleSubject.next('Shifts Master');
        Communications.pageBackButtonSubject.next(null);
    }, [init, getRegions, getHcpTypes, getFacilityData])

    return <>
        <div className={'shift-master screen crud-layout pdd-30'}>
            {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                <LinearProgress />
            </div>}
            <DialogComponent class={'dialog-side-wrapper'} open={open} cancel={cancelopenFilters}>
                <ShiftFilter
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    regions={regions}

                    selectedHcps={selectedHcps}
                    setSelectedHcps={setSelectedHcps}
                    selectedTimeTypes={selectedTimeTypes}
                    setSelectedTimeTypes={setSelectedTimeTypes}
                    selectedFaciltities={selectedFacilities}
                    setSelectedFacilities={setSelectedFacilities}
                    selectedStatusTypes={selectedStatusTypes}
                    setSelectedStatusTypes={setSelectedStatusTypes}
                    setSelectedDates={setSelectedDates}
                    selectedDates={selectedDates}

                    isMaster={true}
                    noStatus={false}
                    resetFilters={resetFilters}
                    cancel={cancelopenFilters}
                    confirm={confirmopenFilters}
                    facilityList={facilityList}
                    hcpTypes={hcpTypes}
                    setHcpTypeRef={setHcpTypeRef}
                    hcpTypeRef={hcpTypeRef}
                    setStatusRef={setStatusRef}
                    valueRef={valueRef}
                    setValueRef={setValueRef}
                    facilityIdRef={facilityIdRef}
                    setFacilityIdRef={setFacilityIdRef}
                    timeTypeRef={timeTypeRef}
                    statusRef={statusRef}
                    setTimeTypeRef={setTimeTypeRef} />
            </DialogComponent>
            <div className="header">
                <div className="filter"></div>
                <div className="action">
                    {/* <Button variant={"contained"} className={'normal'} color={"secondary"} >
                        Download All
                    </Button> */}
                </div>
            </div>
            <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-20 mrg-top-0">
                <div className="mrg-left-5 header">
                    <div className="filter">
                        <div className="d-flex">
                            <div className="position-relative">
                                <CssTextField defaultValue={''} onChange={event => {
                                    if (list && list.table) {
                                        list.table.filter.search = event.target.value;
                                        list.table.reload();
                                        list?.table.pageEvent(0)
                                    }
                                }}  className = "searchField"  variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Shift'} />
                                <div style={{ position: 'absolute', top: '9px', right: "7px" }}>
                                    <SearchRounded className="search-icon" />
                                </div>
                            </div>

                            {/* <div>
                            <Autocomplete
                            PaperComponent={({ children }) => (
                        <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                    )}
                                options={hcpTypes}
                                getOptionLabel={(option: any) => option.label}
                                placeholder={"Applied For"}
                                style={{ width: "200px", height: "35px" }}
                                className="mrg-left-20"
                                onChange={(value: any) =>
                                    setHcpType(value)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        id='select_dashboard_doctor'
                                        variant='outlined'
                                        placeholder={"Hcp Type"}
                                    />
                                )}
                            />
                        </div> */}
                            {/* <div>
                            <Autocomplete
                            PaperComponent={({ children }) => (
                        <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                    )}
                                options={shiftType}
                                getOptionLabel={(option: any) => option.label}
                                placeholder={"Applied For"}
                                style={{ width: "200px", height: "15px" }}
                                className="mrg-left-20"
                                onChange={(value: any) =>
                                    setHcpType(value)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant='outlined'
                                        placeholder={"Time Type"}
                                    />
                                )}
                            />
                        </div> */}
                        </div>
                    </div>
                    <div className="actions">
                        <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                    </div>
                </div>
                {list && list.table && <>
                    <TableContainer component={Paper} className={'table-responsive'}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                        <TableCell className={(column === 'actions') ? 'min-width-cell' : ''}
                                            key={'header-col-' + columnIndex}
                                        >
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list.table.canShowNoData() &&
                                    <NoDataCardComponent tableCellCount={list.table.matColumns.length} />
                                }
                                {list?.table.data.map((row: any, rowIndex: any) => {
                                    const shift_date = CommonService.getUtcDate(row['shift_date'])

                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={'row-' + rowIndex}>
                                            <TableCell>
                                                {row['title']}
                                            </TableCell>
                                            <TableCell>
                                                {row['facility']?.facility_name}
                                            </TableCell>
                                            <TableCell>
                                                {shift_date}
                                            </TableCell>
                                            <TableCell>
                                                {row['hcp_user']?.first_name}&nbsp;{row['hcp_user']?.last_name}
                                            </TableCell>
                                            <TableCell>
                                                {row['hcp_user']?.hcp_type}
                                            </TableCell>
                                            <TableCell>
                                                {row['shift_type']}
                                            </TableCell>
                                            <TableCell className={row['shift_status']}>
                                                {row['shift_status']}
                                            </TableCell>
                                            <TableCell>
                                                <Link to={'/shiftMaster/view/' + row['_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
                                                    {('View Details')}
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
                </>}
            </div>
        </div>
    </>
}

export default ShiftsMasterListScreen;