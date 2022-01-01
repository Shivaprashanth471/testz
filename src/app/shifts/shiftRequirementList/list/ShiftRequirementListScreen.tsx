import { Button, LinearProgress, TablePagination, TextField } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { AddRounded, SearchRounded } from '@material-ui/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
import DialogComponent from "../../../../components/DialogComponent";
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import { ENV } from '../../../../constants';
import { ApiService, CommonService, Communications } from '../../../../helpers';
import ShiftFilter from "../../filters/ShiftFilter";
import { withStyles } from '@material-ui/core/styles';
import "./ShiftRequirementListScreen.scss";
import ClearIcon from '@material-ui/icons/Clear';

const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#10c4d3',
            },
        },
    },
})(TextField);

const ShiftRequirementListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const [facilityList, setFacilityList] = useState<any | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [regions, setRegions] = useState<any>([])
    const [selectedRegion, setSelectedRegion] = useState<string>('')

    const [statusType, setStatusType] = useState<any>('')
    const [selectedHcps, setSelectedHcps] = useState<any>([])
    const [selectedFacilities, setSelectedFacilities] = useState<any>([])
    const [selectedTimeTypes, setSelectedTimeTypes] = useState<any>([])
    const [selectedDates, setSelectedDates] = useState<any>(null);


    const facilityIdRef = useRef<any>('')
    const hcpTypeRef = useRef<any>('')
    const statusRef = useRef<any>('')
    const valueRef = useRef<any>(null)
    const timeTypeRef = useRef<any>('')

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

    const classesFunction = useCallback((type: any) => {
        if (type === "Actions") {
            return "last-row"
        } else if (type === "Title") {
            return 'pdd-left-20 first-row'
        }
    }, [])

    const getHcpTypes = useCallback(() => {
        CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
            setHcpTypes(resp.data || []);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

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


    const getFacilityData = useCallback(() => {
        let payload: any = {}
        if (selectedRegion) {
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

    useEffect(() => getFacilityData(), [selectedRegion, getFacilityData])




    const init = useCallback(() => {

        let url = "shift/requirement/list?"
        let payload: any = {}


        if (selectedFacilities.length > 0) {
            payload.facilities = selectedFacilities.map((item: any) => item?._id)
        }
        if (selectedHcps.length > 0) {
            payload.hcp_types = selectedHcps
        }
        if (statusType) {
            url = url + "&status=" + statusType
            payload.status = statusType
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
            webMatColumns: ['Title', 'Facility Name', 'Shift Date', 'Type of HCP', 'No. of Hcps', 'Shift Hours', 'Time Type', 'Status', 'Actions'],
            mobileMatColumns: ['Title', 'Facility Name', 'Shift Date', 'Type of HCP', 'No. of Hcps', 'Shift Hours', 'Time Type', 'Status', 'Actions'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [selectedTimeTypes, selectedHcps, selectedFacilities, statusType, selectedDates])

    const clearFilterValues = () => {
        facilityIdRef.current = ""
        hcpTypeRef.current = ""
        statusRef.current = ""
        valueRef.current = null
        timeTypeRef.current = ""

        setSelectedTimeTypes([])
        setSelectedFacilities([])
        setSelectedHcps([])
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
        Communications.pageTitleSubject.next('Shifts Requirements');
        Communications.pageBackButtonSubject.next(null);
    }, [init, getHcpTypes, getRegions, getFacilityData])
    return <>
        <div className={'shift-requirment-list screen crud-layout pdd-30'}>
            {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                <LinearProgress />
            </div>}
            <DialogComponent class={'dialog-side-wrapper'} open={open} cancel={cancelopenFilters}>
                <ShiftFilter
                    regions={regions}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    setSelectedDates={setSelectedDates}
                    selectedHcps={selectedHcps}
                    setSelectedHcps={setSelectedHcps}
                    selectedTimeTypes={selectedTimeTypes}
                    setSelectedTimeTypes={setSelectedTimeTypes}
                    selectedFaciltities={selectedFacilities}
                    setSelectedFacilities={setSelectedFacilities}
                    statusType={statusType}
                    setStatusType={setStatusType}
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
            <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0">
                <div className="header">
                    <div className="mrg-left-5 filter">
                        <div>
                            <div className="d-flex">
                                <div className="d-flex position-relative">
                                    {!list?.table.filter.search ?
                                        <div className={"search_icon"}>
                                            <SearchRounded />
                                        </div> : <div className={"search_icon"}><ClearIcon onClick={event => {
                                            if (list && list.table) {
                                                list.table.filter.search = '';
                                                list.table.reload();
                                                list?.table.pageEvent(0)
                                            }

                                        }} id="clear_requirment_search" /></div>}
                                    <div>
                                        <CssTextField defaultValue={''} className="search-cursor searchField" id="input_search_requirment" onChange={event => {
                                            if (list && list.table) {
                                                list.table.filter.search = event.target.value;
                                                list.table.reload();
                                                list?.table.pageEvent(0)
                                            }
                                        }} value={list?.table.filter.search} variant={"outlined"} size={"small"} type={'text'} placeholder={('Search Requirement')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="actions d-flex">
                        <div>
                            <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                        </div>
                        <div className="mrg-left-20">
                            <Button component={Link} to={'/shift/add'} variant={"contained"} color={"primary"} >
                                <AddRounded />&nbsp;&nbsp;Add New&nbsp;&nbsp;
                            </Button>
                        </div>
                    </div>
                </div>
                {list && list.table && <>
                    <TableContainer component={Paper} className={'table-responsive'}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                        <TableCell className={classesFunction(column)}
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
                                    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(row['shift_timings']?.start_time, row['shift_timings']?.end_time)
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
                                                {row['hcp_type']}
                                            </TableCell>
                                            <TableCell>
                                                {row['hcp_count']}
                                            </TableCell>
                                            <TableCell>
                                                {start_time}&nbsp;-&nbsp;{end_time}
                                            </TableCell>
                                            <TableCell>
                                                {row['shift_type']}
                                            </TableCell>
                                            <TableCell className={row['status']}>
                                                {row['status']}
                                            </TableCell>
                                            <TableCell >
                                                <Link to={'/shiftsRequirements/view/' + row['_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
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


export default ShiftRequirementListScreen;
