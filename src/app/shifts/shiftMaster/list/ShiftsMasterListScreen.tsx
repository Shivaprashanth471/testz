import { TextField } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { SearchRounded } from "@material-ui/icons";
import ClearIcon from '@material-ui/icons/Clear';
import moment from "moment";
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
import LoaderComponent from "../../../../components/LoaderComponent";
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import { useLocalStorage } from "../../../../components/useLocalStorage";
import { ENV } from '../../../../constants';
import { ApiService, CommonService, Communications } from '../../../../helpers';
import ShiftFilter from "../../filters/ShiftFilter";
import './ShiftsMasterListScreen.scss';

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
    const [facilityList, setFacilityList] = useState<any | null>(null);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const [regions, setRegions] = useState<any>([])

    const [selectedRegion, setSelectedRegion] = useLocalStorage<string>('selectedRegion', '')
    const [selectedHcps, setSelectedHcps] = useLocalStorage<any[]>('selectedHcps', [])
    const [selectedFacilities, setSelectedFacilities] = useLocalStorage<any[]>('selectedFacilities', [])
    const [selectedTimeTypes, setSelectedTimeTypes] = useLocalStorage<any[]>('selectedTimeTypes', [])
    const [dateRange, setDateRange] = useLocalStorage<any[]>('dateRange', [null, null])
    const [selectedStatusTypes, setSelectedStatusTypes] = useLocalStorage<any[]>('selectedStatusTypes', [])

    const [isFacilityListLoading, setIsFacilityListLoading] = useState<boolean>(false)


    const classesFunction = useCallback((type: any) => {
        if (type === "Actions") {
            return "last-row"
        } else if (type === "Title") {
            return 'pdd-left-20 first-row'
        }
    }, [])

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
        setIsFacilityListLoading(true)
        let payload: any = {}
        if (selectedRegion) {
            payload.regions = [selectedRegion]
        }
        ApiService.post(ENV.API_URL + "facility/lite", payload)
            .then((res) => {
                setFacilityList(res?.data || []);
                setIsFacilityListLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsFacilityListLoading(false)
            });
    }, [selectedRegion]);

    useEffect(() => getFacilityData(), [selectedRegion, getFacilityData])



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

        if (selectedTimeTypes.length > 0) {
            payload.shift_types = selectedTimeTypes
        }

        const options = new TsDataListOptions({
            extraPayload: payload,
            webMatColumns: ['Title', 'Facility Name', 'Shift Date', 'HCP Name', 'HCP Type', 'Time Type', 'Status', 'Actions'],
            mobileMatColumns: ['Title', 'Facility Name', 'Shift Date', 'HCP Name', 'HCP Type', 'Time Type', 'Status', 'Actions'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });

    }, [dateRange, selectedStatusTypes, selectedTimeTypes, selectedHcps, selectedFacilities])


    const clearFilterValues = () => {
        setSelectedTimeTypes([])
        setSelectedFacilities([])
        setSelectedHcps([])
        setSelectedStatusTypes([])
        setSelectedRegion('')
        setDateRange([null, null])
    }

    const resetFilters = () => {
        clearFilterValues()
    }

    useEffect(() => {
        init()
        getRegions()
        getHcpTypes()
        Communications.pageTitleSubject.next('Shifts Master');
        Communications.pageBackButtonSubject.next(null);
    }, [init, getRegions, getHcpTypes])

    return <>
        <div className={'shift-master screen crud-layout pdd-30'}>
            {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                <LoaderComponent />
            </div>}

            <ShiftFilter
                isFacilityListLoading={isFacilityListLoading}
                dateRange={dateRange}
                setDateRange={setDateRange}
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

                isMaster={true}
                noStatus={false}
                resetFilters={resetFilters}

                facilityList={facilityList}
                hcpTypes={hcpTypes}

            />

            <div className="header">
                <div className="filter"></div>
                <div className="action">
                    {/* <Button variant={"contained"} className={'normal'} color={"secondary"} >
                        Download All
                    </Button> */}
                </div>
            </div>
            <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-20 mrg-top-0">
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
                                            <TableCell className={`captalize ${row['shift_status']}`}>
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