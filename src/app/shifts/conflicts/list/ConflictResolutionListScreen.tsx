import React, { useCallback, useEffect, useState } from 'react';
import { Communications, ApiService, CommonService } from '../../../../helpers';
import './ConflictResolutionListScreen.scss';
import { LinearProgress } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import { shiftType, hcpTypes } from '../../../constants/data';
import moment from 'moment';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
// import ComingSoonComponent from '../../../components/ComingSoonComponent';
import { ENV } from '../../../../constants';
import NoDataCardComponent from '../../../../components/NoDataCardComponent';


const ConflictResolutionListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    // const [hcp_type, setHcpType] = useState<any>(null)
    const init = useCallback(() => {
        if (!list) {
            const options = new TsDataListOptions({
                webMatColumns: ['Facility Name', 'Shift Date', 'Type of HCP', 'Time Type', 'Issue Raised By', 'Status', 'Action'],
                mobileMatColumns: ['Facility Name', 'Shift Date', 'Type of HCP', 'Time Type', 'Issue Raised By', 'Status', 'Action'],
            }, ENV.API_URL + 'shift/requirement', setList, ApiService, 'get');

            let tableWrapperObj = new TsDataListWrapperClass(options)
            setList({ table: tableWrapperObj });
        }
    }, [list])

    useEffect(() => {
        init()
        Communications.pageTitleSubject.next('Conflicts Resolution');
        Communications.pageBackButtonSubject.next(null);
    }, [init])
    return <>
        <div className={'shift-master screen crud-layout pdd-30'}>
            {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                <LinearProgress />
            </div>}
            <div className="header">
                <div className="filter">
                    <div className="d-flex">
                        {/* <div className="position-relative">
                    <TextField defaultValue={''} onChange={event => {
                        if (list && list.table) {
                            list.table.filter.search = event.target.value;
                            list.table.reload();
                            list?.table.pageEvent(0)
                        }
                    }} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search HCP'} />
                    <div style={{ position: 'absolute', top: '9px', right: "7px" }}>
                        <SearchRounded className="search-icon" />
                    </div>
                </div> */}

                        {/* <div>
                    <Autocomplete
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
                                            {moment(row['shift_timings']?.start_time).format("HH:mm")} &nbsp;-&nbsp;{moment(row['shift_timings']?.end_time).format("HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            {row['shift_type']}
                                        </TableCell>
                                        <TableCell >
                                            <Link to={'/conflicts/view/' + row['id']} className="info-link" id={"link_hospital_details" + rowIndex} >
                                                {('View Details')}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {/* <TablePagination
                    rowsPerPageOptions={list.table.pagination.pageSizeOptions}
                    component='div'
                    count={list?.table.pagination.totalItems}
                    rowsPerPage={list?.table.pagination.pageSize}
                    page={list?.table.pagination.pageIndex}
                    onPageChange={(event, page) => list.table.pageEvent(page)}
                    onRowsPerPageChange={event => list.table?.pageEvent(0, +event.target.value)}
                /> */}
                </TableContainer>
            </>}
        </div>
    </>
}

export default ConflictResolutionListScreen;