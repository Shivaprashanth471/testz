import { LinearProgress, TextField } from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../../classes/ts-data-list-wrapper.class';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import NoDataCardComponent from '../../../../../components/NoDataCardComponent';
import { ApiService, Communications } from '../../../../../helpers';
import { ENV } from '../../../../../constants';

const HcpListComponent = (props: any) => {
    const [list, setList] = useState<TsDataListState | null>(null);

    const init = useCallback(() => {
        let url = "hcp?is_approved=0"

        // if (hcpType?.current !== "") {
        //     url = url + "&hcp_type=" + hcpType?.current
        // }
        // if (status?.current !== "") {
        //     url = url + "&is_active=" + status?.current
        // }
        // if (value?.current instanceof Array) {
        //     if (value.current[1]) {
        //         url = url + "&start_date=" + value.current[0] + "&end_date=" + value.current[1]
        //     } else {
        //         url = url + "&start_date=" + value.current[0] + "&end_date=" + value.current[0]
        //     }
        // }
        const options = new TsDataListOptions({
            webMatColumns: ['HCP Name', 'HCP Rating', 'Contact Number', 'Type Of HCP', 'Last Contacted On', 'Status', 'Action'],
            mobileMatColumns: ['HCP Name', 'HCP Rating', 'Contact Number', 'Type Of HCP', 'Last Contacted On', 'Status', 'Action'],
        }, ENV.API_URL + url, setList, ApiService, 'get');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [])

    useEffect(() => {
        init();
        Communications.pageTitleSubject.next('HCP Onboarding');
        Communications.pageBackButtonSubject.next(null);
    }, [init])

    return (
        <>
            <div className={'hcp-list'}>
                {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                    <LinearProgress />
                </div>}
                <div className="custom-border pdd-10  pdd-top-20 pdd-bottom-0">
                    <div className="header">
                        <div className="mrg-left-5 filter">
                            <div className="position-relative  d-flex">
                                <div style={{ position: 'absolute', top: '9px', left: '190px' }}>
                                    <SearchRounded className="search-icon" />
                                </div>
                                <div>
                                    <TextField defaultValue={''} onChange={event => {
                                        if (list && list.table) {
                                            list.table.filter.search = event.target.value;
                                            list.table.reload();
                                            list?.table.pageEvent(0)
                                        }
                                    }} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search HCP'} />
                                </div>
                            </div>
                        </div>
                        {/* <div className="action">
                            <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                        </div> */}
                    </div>
                    {list && list.table && <>
                        <TableContainer component={Paper} className={'table-responsive'}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead className={"mat-thead"}>
                                     <TableRow className={"mat-tr"}>
                                        {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                            <TableCell className={(column === 'actions') ? 'min-width-cell' : ''}
                                                key={'header-col-' + columnIndex}
                                            >
                                                {column}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                               <TableBody className={"mat-tbody"}>
                                    {list.table.canShowNoData() &&
                                        <NoDataCardComponent tableCellCount={list.table.matColumns.length} />
                                    }
                                    {list?.table.data.map((row: any, rowIndex: any) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={'row-' + rowIndex}>
                                                <TableCell>
                                                    {row['first_name']}&nbsp;{row['last_name']}
                                                </TableCell>
                                                <TableCell>

                                                </TableCell>
                                                <TableCell>
                                                    {row['contact_number']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_type']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_type']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['is_active'] ? 'Active' : 'Inactive'}
                                                </TableCell>
                                                <TableCell >
                                                    <Link to={'/hcp/view/' + row['_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
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
    )
}

export default HcpListComponent;