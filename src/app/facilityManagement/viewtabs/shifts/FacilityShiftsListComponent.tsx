import React, { useCallback, useEffect } from "react";
import './FacilityShiftsListComponent.scss';
import { LinearProgress, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../../constants";
import { ApiService, Communications } from "../../../../helpers";
import moment from "moment";
import { SearchRounded } from "@material-ui/icons";
import FilterListIcon from '@material-ui/icons/FilterList';
import NoDataCardComponent from "../../../../components/NoDataCardComponent";

const FacilityShiftsListComponent = () => {
    const [list, setList] = React.useState<TsDataListState | null>(null);

    const init = useCallback(() => {
        if (!list) {
            const options = new TsDataListOptions({
                webMatColumns: [
                    "Requested On",
                    "Hcp Name",
                    "Hcp Type",
                    "Shift Date",
                    "Status",
                    "Actions",
                ],
                mobileMatColumns: [
                    "Requested On",
                    "Hcp Name",
                    "Hcp Type",
                    "Shift Date",
                    "Status",
                    "Actions",
                ],
            },
                ENV.API_URL + "shift", setList, ApiService, "post");
            let tableWrapperObj = new TsDataListWrapperClass(options);
            setList({ table: tableWrapperObj });
        }
    }, [list]);

    useEffect(() => {
        init();
        Communications.pageTitleSubject.next("Facility Management");
        Communications.pageBackButtonSubject.next(null);
    }, [init]);

    return (
        <Paper>
            <div className={"facility-list screen crud-layout"}>
                {list && list.table?._isDataLoading && (
                    <div className="table-loading-indicator">
                        <LinearProgress />
                    </div>
                )}
                <div className="header">
                    <div className="filter">
                        <div className="position-relative">
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
                                }} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Facility'} />
                            </div>
                        </div>
                    </div>
                    <div className="actions mrg-left-30">
                        <FilterListIcon />
                    </div>
                </div>
                {list && list.table && (
                    <>
                        <TableContainer className={"table-responsive"}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead className={"mat-thead"}>
                                     <TableRow className={"mat-tr"}>
                                        {list?.table.matColumns.map(
                                            (column: any, columnIndex: any) => (
                                                <TableCell
                                                    className={
                                                        column === "actions" ? "min-width-cell" : ""
                                                    }
                                                    key={"header-col-" + columnIndex}
                                                >
                                                    {column}
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                </TableHead>
                               <TableBody className={"mat-tbody"}>
                                    {list.table.canShowNoData() &&
                                        <NoDataCardComponent tableCellCount={list.table.matColumns.length} />
                                    }
                                    {list?.table.data.map((row: any, rowIndex: any) => {
                                        console.log(row, "row");
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={"row-" + rowIndex}
                                            >
                                                <TableCell>
                                                    {moment(row['created_at']).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_user']?.first_name}&nbsp; {row['hcp_user']?.last_name}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_user']?.hcp_type}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(row['shift_date']).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    {row['shift_status']}
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={'/shiftMaster/view/' + row['id']} className="info-link" id={"link_hospital_details" + rowIndex} >
                                                        {('View Details')}
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {/*<TablePagination*/}
                            {/*    rowsPerPageOptions={list.table.pagination.pageSizeOptions}*/}
                            {/*    component='div'*/}
                            {/*    count={list?.table.pagination.totalItems}*/}
                            {/*    rowsPerPage={list?.table.pagination.pageSize}*/}
                            {/*    page={list?.table.pagination.pageIndex}*/}
                            {/*    onPageChange={(event, page) => list.table.pageEvent(page)}*/}
                            {/*    onRowsPerPageChange={event => list.table?.pageEvent(0, +event.target.value)}*/}
                            {/*/>*/}
                        </TableContainer>
                    </>
                )}
            </div>
        </Paper>
    );
};


export default FacilityShiftsListComponent;