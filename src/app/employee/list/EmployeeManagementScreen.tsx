import { Button, TablePagination } from '@material-ui/core';
import { Link } from "react-router-dom";
import { AddRounded, SearchRounded } from '@material-ui/icons';
import { LinearProgress, Paper,TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../classes/ts-data-list-wrapper.class';
import { ENV } from '../../../constants';
import { ApiService, Communications } from '../../../helpers';
// import { StateParams } from '../../../store/reducers';
import FilterListIcon from '@material-ui/icons/FilterList';
import NoDataCardComponent from '../../../components/NoDataCardComponent';
import moment from 'moment';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const EmployeeManagementScreen = () => {
  
    const [list, setList] = useState<TsDataListState | null>(null);
  //const [regionList, setRegionList] = useState<any | null>(null);
 // const { role } = useSelector((state: StateParams) => state?.auth?.user);
  const [open, setOpen] = useState<boolean>(false);
//   const region = useRef<any>("")
//   const status = useRef<any>("")
//   const value = useRef<any>(null)

console.log(open)

//   const setRegionRef = (val: any) => {
//     region.current = val
//   }

//   const setStatusRef = (val: any) => {
//     status.current = val
//   }

//   const setValueRef = (val: any) => {
//     value.current = val
//   }

  // const onReload = useCallback((page = 1) => {
  //   if (list) {
  //     list.table.reload(page);
  //   } else {
  //     setList(prevState => {
  //       prevState?.table.reload(page);
  //       return prevState;
  //     })
  //   }
  // }, [list]);


//   const getRegions = useCallback(() => {
//     CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
//       setRegionList(resp.data || []);
//     }).catch((err) => {
//       console.log(err);
//     });
//   }, []);



  const init = useCallback(() => {
    let url = "user?"
    // if (region?.current !== "") {
    //   url = url + "&region=" + region?.current

    // }
    // if (status?.current !== "") {
    //   url = url + "&is_active=" + status?.current

    // }
    // if (value.current instanceof Array) {
    //   if (value.current[1]) {
    //     url = url + "&start_date=" + value.current[0] + "&end_date=" + value.current[1]
    //   } else {
    //     url = url + "&start_date=" + value.current[0] + "&end_date=" + value.current[0]

    //   }

    // }
    const options = new TsDataListOptions({
      webMatColumns: ['Created On', "Employee Name", "Contact Number", 'Email', 'Role', "Actions"],
      mobileMatColumns: ['Created On', "Employee Name", "Contact Number", 'Email', 'Role', "Actions"]
    },
      ENV.API_URL + url, setList, ApiService, "get");
    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
  }, []);

//   const clearFilterValues = () => {
//     region.current = ""
//     status.current = ""
//     value.current = null
//   }

  const openFilters = useCallback((index: any) => {
  //  clearFilterValues()
    setOpen(true)
  }, [])

  // const cancelopenFilters = useCallback(() => {
  //   setOpen(false)
  // }, [])

  // const resetFilters = useCallback(() => {
  //  // clearFilterValues()
  //   init()
  // }, [init])

  // const confirmopenFilters = useCallback(() => {
  //   init()
  //   setOpen(false)
  // }, [init])

  useEffect(() => {
    init();
    Communications.pageTitleSubject.next("Employee Mangement");
    Communications.pageBackButtonSubject.next(null);
  }, [init]);

  return (
    <>
      <div className={"facility-list screen crud-layout pdd-30"}>
        {list && list.table?._isDataLoading && (
          <div className="table-loading-indicator">
            <LinearProgress />
          </div>
        )}
        <div className="header">
          <div className="filter"></div>
            <div className="actions">
              <Button
                variant={"contained"}
                color={"primary"}
                component={Link}
                to={`/employee/add`}
              >
                <AddRounded />
                &nbsp;&nbsp;Add Employee
              </Button>
            </div>
        </div>
        <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0 mrg-top-20">
          <div className="header">
            <div className="mrg-left-5 filter">
              <div className="position-relative">
                <div style={{ position: 'absolute', top: '9px', left: '190px' }}>
                  <SearchRounded className="search-icon" />
                </div>
                <div>
                  <TextField defaultValue={''} onChange={event => {
                    if (list && list.table) {
                      list.table.filter.search = event?.target?.value;
                      list.table.reload();
                      list?.table.pageEvent(0)
                    }
                  }} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Facility'} />
                </div>
              </div>
            </div>
            <div className="action pdd-right-5">
              <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
            </div>
          </div>
          {list && list.table && (
            <>
              <TableContainer component={Paper} className={"table-responsive"}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead className={"mat-thead"}>
                     <TableRow className={"mat-tr"}>
                      {list?.table.matColumns.map(
                        (column: any, columnIndex: any) => (
                          <TableCell
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
                      <NoDataCardComponent tableCellCount={list.table.matColumns.length} />}
                    {list?.table.data.map((row: any, rowIndex: any) => {
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
                          <TableCell>{row['first_name']}&nbsp;{row['last_name']}</TableCell>
                          <TableCell>{row['contact_number']}</TableCell>
                          <TableCell>{row['email']}</TableCell>
                          <TableCell>{row['role']}</TableCell>
                         
                          <TableCell>
                            <Link
                              to={"/employee/view/" + row?._id}
                              className="info-link"
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
}

export default EmployeeManagementScreen;