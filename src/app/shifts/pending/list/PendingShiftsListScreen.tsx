import { LinearProgress, TextField } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { SearchRounded } from '@material-ui/icons';
import FilterListIcon from '@material-ui/icons/FilterList';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
import DialogComponent from '../../../../components/DialogComponent';
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import { ENV } from '../../../../constants';
import { ApiService, CommonService, Communications } from '../../../../helpers';
import ShiftFilter from '../../filters/ShiftFilter';
import './PendingShiftsListScreen.scss';
import { withStyles } from '@material-ui/core/styles';
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
const PendingShiftsListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [facilityList, setFacilityList] = useState<any | null>(null);

    const [selectedHcps, setSelectedHcps] = useState<any>([])
    const [selectedFacilities, setSelectedFacilities] = useState<any>([])
    const [selectedTimeTypes, setSelectedTimeTypes] = useState<any>([])
    const [selectedDates, setSelectedDates] = useState<any>(null);

    const facilityIdRef = useRef<any>('')
    const hcpTypeRef = useRef<any>('')
    const valueRef = useRef<any>(null)
    const timeTypeRef = useRef<any>('')

    const [regions, setRegions] = useState<any>([])
    const [selectedRegion, setSelectedRegion] = useState<string>('')

    const classesFunction = useCallback((type: any) => {
        if (type === "Actions") {
            return "last-row"
        } else if (type === "Title") {
            return 'first-row'
        }
    }, [])

    const setFacilityIdRef = (val: any) => {
        facilityIdRef.current = val;
    }
    const setHcpTypeRef = (val: any) => {
        hcpTypeRef.current = val;
    }

    const setValueRef = (val: any) => {
        valueRef.current = val;
    }

    const setTimeTypeRef = (val: any) => {
        timeTypeRef.current = val;
    }

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
        let url = 'shift'
        let payload: any = {}

        payload.shift_status = 'pending';
        if (selectedFacilities.length > 0) {
            payload.facilities = selectedFacilities.map((item: any) => item?._id)
        }

        if (selectedHcps.length > 0) {
            payload.hcp_types = selectedHcps
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
            webMatColumns: ['Title', 'Requested On', 'Facility Name', 'Require On', 'HCP Name', 'Type of hcp', 'Time Type', 'Actions'],
            mobileMatColumns: ['Title', 'Requested On', 'Facility Name', 'Require On', 'HCP Name', 'Type of hcp', 'Time Type', 'Actions'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });

    }, [selectedFacilities, selectedHcps, selectedTimeTypes, selectedDates])

    const clearFilterValues = () => {
        facilityIdRef.current = ""
        hcpTypeRef.current = ""
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
        Communications.pageTitleSubject.next('Shifts Approved');
        Communications.pageBackButtonSubject.next(null);
    }, [init, getFacilityData, getRegions, getHcpTypes])
    return <div className="pending-shifts screen crud-layout pdd-30">
        {list && list.table?._isDataLoading && <div className="table-loading-indicator">
            <LinearProgress />
        </div>}
        <DialogComponent class={'dialog-side-wrapper'} open={open} cancel={cancelopenFilters}>
            <ShiftFilter
                regions={regions}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}

                selectedHcps={selectedHcps}
                setSelectedHcps={setSelectedHcps}
                selectedTimeTypes={selectedTimeTypes}
                setSelectedTimeTypes={setSelectedTimeTypes}
                selectedFaciltities={selectedFacilities}
                setSelectedFacilities={setSelectedFacilities}
                setSelectedDates={setSelectedDates}
                selectedDates={selectedDates}

                noStatus={true}
                isRequired={true}
                resetFilters={resetFilters}
                cancel={cancelopenFilters}
                confirm={confirmopenFilters}
                facilityList={facilityList}
                hcpTypes={hcpTypes}
                setHcpTypeRef={setHcpTypeRef}
                hcpTypeRef={hcpTypeRef}

                valueRef={valueRef}
                setValueRef={setValueRef}
                facilityIdRef={facilityIdRef}
                setFacilityIdRef={setFacilityIdRef}
                timeTypeRef={timeTypeRef}

                setTimeTypeRef={setTimeTypeRef} />
        </DialogComponent>
        <div className="custom-border pdd-10 pdd-top-0 pdd-bottom-20 mrg-top-0">
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

                                    }} id="clear_shift_search" /></div>}
                                <div>
                                    <CssTextField defaultValue={''} className="search-cursor searchField" id="input_search_shift" onChange={event => {
                                        if (list && list.table) {
                                            list.table.filter.search = event.target.value;
                                            list.table.reload();
                                            list?.table.pageEvent(0)
                                        }
                                    }} value={list?.table.filter.search} variant={"outlined"} size={"small"} type={'text'} placeholder={('Search Shift')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    {/* <Button variant={"contained"} className={'normal'} color={"secondary"} >
                    Download All
                </Button> */}
                    <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                </div>
            </div>
            {list && list.table && <>
                <TableContainer component={Paper} className={'table-responsive'}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                    <TableCell key={'header-col-' + columnIndex} className={classesFunction(column)}
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
                                            {moment(row['created_at']).format("MM-DD-YYYY")}
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
                                        <TableCell >
                                            <Link to={'/approvedShifts/view/' + row['_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
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
}

export default PendingShiftsListScreen;