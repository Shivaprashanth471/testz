import { Button, TablePagination, TextField, Tooltip } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { AddRounded, SearchRounded } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import DialogComponent from "../../../../components/DialogComponent";
import LoaderComponent from "../../../../components/LoaderComponent";
import NoDataCardComponent from "../../../../components/NoDataCardComponent";
import { useLocalStorage } from "../../../../components/useLocalStorage";
import { ENV } from "../../../../constants";
import { ApiService, CommonService, Communications } from "../../../../helpers";
import ShiftFilter from "../../filters/ShiftFilter";
import RejectShiftRequirementComponent from "../rejectShiftRequirement/RejectShiftRequirementComponent";
import "./ShiftRequirementListScreen.scss";
import Checkbox from '@material-ui/core/Checkbox';

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#10c4d3",
      },
    },
  },
})(TextField);

const ShiftRequirementListScreen = () => {
  const [list, setList] = useState<TsDataListState | null>(null);
  const [hcpTypes, setHcpTypes] = useState<any | null>(null);
  const [facilityList, setFacilityList] = useState<any | null>(null);
  const [regions, setRegions] = useState<any>([]);
  const [isRejectShiftOpen, setRejectShiftOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useLocalStorage<string>("selectedRegion", "");
  const [statusType, setStatusType] = useLocalStorage<any | string>("statusType", "open");
  const [selectedHcps, setSelectedHcps] = useLocalStorage<any[]>("selectedHcps", []);
  const [selectedFacilities, setSelectedFacilities] = useLocalStorage<any[]>("selectedFacilities", []);
  const [selectedTimeTypes, setSelectedTimeTypes] = useLocalStorage<any[]>("selectedTimeTypes", []);
  const [dateRange, setDateRange] = useLocalStorage<any[]>("dateRange", [null, null]);
  const [isFacilityListLoading, setIsFacilityListLoading] = useState<boolean>(false);
  const [pageSizeIndex, setPageSizeIndex] = useLocalStorage<any>("shiftReqPageSizeIndex", 10);
  const [selectedShifts, setSelectedShifts] = useState<any>([])
  const [isAllselected, setAllSelected] = useState<boolean>(false);
  const [selectedCount, setSelectedCount] = useState<any>(-1)

  const getHcpTypes = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
      setHcpTypes(resp.data || []);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRegions = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
      setRegions(resp.data || []);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getFacilityData = useCallback(() => {
    setIsFacilityListLoading(true);
    let payload: any = {};
    if (selectedRegion) {
      payload.regions = [selectedRegion];
    }
    ApiService.post(ENV.API_URL + "facility/lite", payload).then((res) => {
        setFacilityList(res?.data || []);
        setIsFacilityListLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFacilityListLoading(false);
      });
  }, [selectedRegion]);

  useEffect(() => getFacilityData(), [selectedRegion, getFacilityData]);

  const init = useCallback(() => {
    let url = "shift/requirement/list?";
    let payload: any = {};

    if (selectedFacilities.length > 0) {
      payload.facilities = selectedFacilities.map((item: any) => item?._id);
    }
    if (selectedHcps.length > 0) {
      payload.hcp_types = selectedHcps;
    }
    if (statusType) {
      url = url + "&status=" + statusType;
      payload.status = statusType;
    }

    if (dateRange[0] || dateRange[1]) {
      let startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      let endDate = moment(dateRange[1]).format("YYYY-MM-DD");

      if (!dateRange[1]) {
        payload.start_date = startDate;
        payload.end_date = startDate;
      } else {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }
    } else {
      let today = moment(new Date()).format("YYYY-MM-DD");
      payload.new_shifts = today;
    }
    if (selectedTimeTypes.length > 0) {
      payload.shift_types = selectedTimeTypes;
    }

    const options = new TsDataListOptions(
      {
        // @ts-ignore
        pagination: {
          ...list?.table?.pagination,
          pageSize: pageSizeIndex,
        },
        extraPayload: payload,
        webMatColumns: ["Title", "Facility Name", "Shift Date", "Type of HCP", "No. of Hcps", "Shift Hours", "Time Type", "HCP'S Filled", "Status", "Actions"],
        mobileMatColumns: ["Title", "Facility Name", "Shift Date", "Type of HCP", "No. of Hcps", "Shift Hours", "Time Type", "HCP'S Filled", "Status", "Actions"],
      }, ENV.API_URL + url, setList, ApiService, "post");

    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
    // eslint-disable-next-line
  }, []);

  const getList = useCallback(() => {
    if (!list) {
      init();
      return;
    }
    let url = "shift/requirement/list?";
    let payload: any = {};

    if (selectedFacilities.length > 0) {
      payload.facilities = selectedFacilities.map((item: any) => item?._id);
    }
    if (selectedHcps.length > 0) {
      payload.hcp_types = selectedHcps;
    }
    if (statusType) {
      // eslint-disable-next-line
      url = url + "&status=" + statusType;
      payload.status = statusType;
    }

    if (dateRange[0] || dateRange[1]) {
      let startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      let endDate = moment(dateRange[1]).format("YYYY-MM-DD");

      if (!dateRange[1]) {
        payload.start_date = startDate;
        payload.end_date = startDate;
      } else {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }
    } else {
      let today = moment(new Date()).format("YYYY-MM-DD");
      payload.new_shifts = today;
    }
    if (selectedTimeTypes.length > 0) {
      payload.shift_types = selectedTimeTypes;
    }

    list?.table?.setExtraPayload(payload);
    list?.table?.getList(1);
    // eslint-disable-next-line
  }, [dateRange, selectedTimeTypes, selectedHcps, selectedFacilities, statusType, setAllSelected]);

  const handleSelectAll = (event: any) => {
    if (event.target.checked === true) {
      let temp: any[] = []
      list?.table?.data?.forEach((item: any) => {
        temp.push(item._id)
      })
      setSelectedShifts([...temp])
      setSelectedCount(1)
    } else {
      setSelectedShifts([])
      setSelectedCount(-1)
    }
    setAllSelected(event.target.checked)
  }

  const handleSelectShifts = useCallback((event: any, _id: any) => {
    if (event.target.checked === true) {
      setSelectedShifts([...selectedShifts, _id]);
      setSelectedCount(1);
    } else {
      let tempSelectedShifts = selectedShifts?.filter((item: any) => item !== _id)
      setSelectedShifts([...tempSelectedShifts]);
    }
  }, [selectedShifts])

  const clearFilterValues = () => {
    setSelectedTimeTypes([]);
    setSelectedFacilities([]);
    setSelectedHcps([]);
    setDateRange([null, null]);
    setStatusType("");
    setSelectedRegion("");
  };

  const resetFilters = () => {
    clearFilterValues();
  };

  useEffect(() => {
    getRegions();
    getHcpTypes();
    Communications.pageTitleSubject.next("Open Shifts");
    Communications.pageBackButtonSubject.next(null);
  }, [getHcpTypes, getRegions]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    setAllSelected(false)
  }, [list?.table?.data])

  const openRejectShift = useCallback(() => {
    setRejectShiftOpen(true);
  }, [])

  const cancelRejectShift = useCallback(() => {
    setRejectShiftOpen(false);
  }, [])

  const confirmRejectShift = useCallback(() => {
    setRejectShiftOpen(false);
    getList()
  }, [getList])

  const isSelected = useCallback((_id: any) => {
    if (selectedShifts?.indexOf(_id) !== -1) {
      return true;
    }
    else {
      return false;
    }

  }, [selectedShifts])


  useEffect(() => {
    let count = 0;
    list?.table?.data?.forEach((item: any) => {
      if (selectedShifts?.indexOf(item?._id) !== -1) {
        count++
      }
    })
    if (count === pageSizeIndex) {
      setAllSelected(true)
    }else{
      setAllSelected(false)
    }
  }, [list?.table?.data,pageSizeIndex,selectedShifts])

  return (
    <>
      <DialogComponent open={isRejectShiftOpen} cancel={cancelRejectShift}>
        <RejectShiftRequirementComponent cancel={cancelRejectShift} confirm={confirmRejectShift} selectedShifts={selectedShifts} />
      </DialogComponent>
      <div className={"shift-requirment-list screen crud-layout pdd-30"}>
        {list && list.table?._isDataLoading && (
          <div className="table-loading-indicator">
            <LoaderComponent />
          </div>
        )}
        <ShiftFilter
          isFacilityListLoading={isFacilityListLoading}
          dateRange={dateRange}
          setDateRange={setDateRange}
          regions={regions}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
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
          facilityList={facilityList}
          hcpTypes={hcpTypes}
        />
        <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0">
          <div className="header">
            <div className="mrg-left-5 filter">
              <div>
                <div className="d-flex">
                  <div className="d-flex position-relative">
                    {!list?.table.filter.search ? (
                      <div className={"search_icon"}>
                        <SearchRounded />
                      </div>
                    ) : (
                      <div className={"search_icon"}>
                        <ClearIcon
                          onClick={(event) => {
                            if (list && list.table) {
                              list.table.filter.search = "";
                              list.table.reload();
                              // list?.table.pageEvent(0)
                            }
                          }}
                          id="clear_requirment_search"
                        />
                      </div>
                    )}
                    <div>
                      <CssTextField
                        defaultValue={""}
                        className="search-cursor searchField"
                        id="input_search_requirment"
                        onChange={(event) => {
                          if (list && list.table) {
                            list.table.filter.search = event.target.value;
                            list.table.reload();
                            // list?.table.pageEvent(0)
                          }
                        }}
                        value={list?.table.filter.search}
                        variant={"outlined"}
                        size={"small"}
                        type={"text"}
                        placeholder={"Search Requirement"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="actions d-flex">
              <div className="mrg-left-20">
                <Tooltip title={"Cancel Shift Requirement"}>
                  <Button variant={"contained"} color={"primary"} disabled={selectedCount === -1} onClick={openRejectShift}>
                    &nbsp;&nbsp;Cancel Shift&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              </div>
              <div className="mrg-left-20">
                <Tooltip title={"Add New Shift Requirement"}>
                  <Button component={Link} to={"/shift/add"} variant={"contained"} color={"primary"}>
                    <AddRounded />
                    &nbsp;&nbsp;Add New&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          {list && list.table && (
            <>
              <TableContainer component={Paper} className={"table-responsive"}>
                <Table stickyHeader className="mat-table table shift-requirement-list-table">
                  <TableHead className={"mat-thead"}>
                    <TableRow className={"mat-tr"}>
                      <TableCell padding="checkbox" className="mat-th">
                        <Checkbox onChange={(event) => handleSelectAll(event)} checked={isAllselected} id={"select-all-cb"} />
                      </TableCell>
                      {list?.table.matColumns.map((column: any, columnIndex: any) => (
                        <TableCell className={column === "Actions" ? "mat-th mat-th-sticky" : "mat-th"} key={"header-col-" + columnIndex}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody className={"mat-tbody"}>
                    {!list.table._isDataLoading && list.table?.data.length === 0 && <NoDataCardComponent tableCellCount={list.table.matColumns.length} />}
                    {list.table?.data.length > 0 && list?.table.data.map((row: any, rowIndex: any) => {
                      const { start_time, end_time } = CommonService.getUtcTimeInAMPM(row["shift_timings"]?.start_time, row["shift_timings"]?.end_time);
                      const shift_date = CommonService.getUtcDate(row["shift_date"]);
                      const isItemSelected = isSelected(row["_id"]);
                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={"row-" + rowIndex} className={"mat-tr"}>
                          <TableCell className="mat-td mat-td-checkbox">
                            <Checkbox id={"cb_" + rowIndex} checked={isItemSelected} onChange={(event) => handleSelectShifts(event, row['_id'])} />
                          </TableCell>
                          <TableCell className="mat-td mat-td-title">{row["title"]}</TableCell>
                          <TableCell className="mat-td mat-td-facility-name">{row["facility"]?.facility_name}</TableCell>
                          <TableCell className="mat-td mat-td-shift-date">{shift_date}</TableCell>
                          <TableCell className="mat-td mat-td-hcp-type">{row["hcp_type"]}</TableCell>
                          <TableCell className="mat-td mat-td-hcp-count">{row["hcp_count"]}</TableCell>
                          <TableCell className="mat-td mat-td-shift-timings">
                            {start_time}&nbsp;-&nbsp;{end_time}
                          </TableCell>
                          <TableCell className="mat-td mat-td-shift-type">{row["shift_type"]}</TableCell>
                          <TableCell className="mat-td mat-td-shift-type">{row["approved_hcps"] >= 0 ? row["approved_hcps"] + "/" + row['hcp_count'] : "N/A"}</TableCell>
                          <TableCell className={`${row["status"]} mat-td mat-td-status`}>{row["status"]}</TableCell>
                          <TableCell className="mat-td mat-td-sticky mat-td-actions">
                            <Tooltip title={`${row["title"]} view details`}>
                              <Link to={"/shiftsRequirements/view/" + row["_id"]} className="info-link" id={"link_hospital_details" + rowIndex}>
                                {"View Details"}
                              </Link>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={list.table.pagination.pageSizeOptions}
                component="div"
                count={list?.table.pagination.totalItems}
                rowsPerPage={list?.table.pagination.pageSize}
                page={list?.table.pagination.pageIndex}
                onPageChange={(event, page) => list.table.pageEvent(page)}
                onRowsPerPageChange={(event) => {
                  setPageSizeIndex(event.target.value);
                  list.table?.pageEvent(0, +event.target.value);
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShiftRequirementListScreen;
