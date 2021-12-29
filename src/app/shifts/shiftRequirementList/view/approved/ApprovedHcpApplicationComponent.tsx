import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../../classes/ts-data-list-wrapper.class';
import { ENV } from '../../../../../constants';
import { ApiService } from '../../../../../helpers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {  LinearProgress } from "@material-ui/core";
import './ApprovedHcpApplicationComponent.scss';
import moment from 'moment';
import NoDataCardComponent from '../../../../../components/NoDataCardComponent';

export interface ApprovedHcpApplicationComponentProps {
    isAddOpen:Boolean;
}

const ApprovedHcpApplicationComponent = (props: PropsWithChildren<ApprovedHcpApplicationComponentProps>) => {
    const isAddHcpOpen = props?.isAddOpen
    const param = useParams<any>()
    const { id } = param
    const [list, setList] = useState<TsDataListState | null>(null);
    const init = useCallback(() => {
        const options = new TsDataListOptions({
            webMatColumns: ['HCP Name', 'Applied On', 'HCP Rate', 'Approved By','Action'],
            mobileMatColumns: ['HCP Name', 'Applied On', 'HCP Rate', 'Approved By','Action'],
        }, ENV.API_URL + 'shift/requirement/' + id + '/application?status=approved', setList, ApiService, 'get');
        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [id])

    useEffect(() => {
        init()
    }, [init, isAddHcpOpen])
    return <div className='approved-hcps-list'>
        {list && list.table?._isDataLoading && <div className="table-loading-indicator">
            <LinearProgress />
        </div>}
        {list && list.table && <>
            <TableContainer component={Paper} className={'table-responsive'}>
                <Table stickyHeader aria-label="sticky table" style={{ tableLayout: "fixed" }} >
                    <TableHead>
                        <TableRow>
                            {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                <TableCell className={(column === 'Action') ? 'text-right' : ''}
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
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={'row-'}>
                                    <TableCell>
                                        {row['hcp_data']?.first_name}&nbsp;{row['hcp_data']?.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {moment(row['created_at']).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell>
                                        {row['hcp_data']?.rate}
                                    </TableCell>
                                    <TableCell >
                                        {row['approved_by']?.first_name} &nbsp;{row['approved_by']?.last_name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={'/hcp/user/view/' + row['hcp_user_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
                                            {('View Details')}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
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
    </div>;
}

export default ApprovedHcpApplicationComponent;