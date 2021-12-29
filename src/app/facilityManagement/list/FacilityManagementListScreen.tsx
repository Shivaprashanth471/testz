import { Button, LinearProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { AddRounded } from "@material-ui/icons";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../classes/ts-data-list-wrapper.class";
import AccessControlComponent from "../../../components/AccessControl";
import { ENV } from "../../../constants";
import { ApiService, Communications } from "../../../helpers";
import CommonService, { ACCOUNTMANAGER, ADMIN } from "../../../helpers/common-service";
import './FacilityManagementListScreen.scss';
import TablePagination from '@material-ui/core/TablePagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import NoDataCardComponent from "../../../components/NoDataCardComponent";
import moment from "moment";
import { TextField } from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { StateParams } from "../../../store/reducers";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogComponent from "../../../components/DialogComponent";
import FacilityFiltersComponent from "../filters/FacilityFiltersComponent";
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


const FacilityManagementListScreen = () => {
  const [list, setList] = useState<TsDataListState | null>(null);
  const [regionList, setRegionList] = useState<any | null>(null);
  const { role } = useSelector((state: StateParams) => state?.auth?.user);
  const [open, setOpen] = useState<boolean>(false);
  const region = useRef<any>("");
  const status = useRef<any>("");
  const value = useRef<any>(null);
  
  const classesFunction = useCallback((type:any)=>{
    if(type==="Actions"){
      return "text-right"
    }else if(type==='Active / Inactive'){
      return 'text-align'
    }else if(type==="Created On"){
      return 'pdd-left-20'
    }

  },[])
  const [selectedRegions, setSelectedRegions] = useState<any>([])

  const setRegionRef = (val: any) => {
    region.current = val
  }

  const setStatusRef = (val: any) => {
    status.current = val
  }

  const setValueRef = (val: any) => {
    value.current = val
  }

  const onReload = useCallback((page = 1) => {
    if (list) {
      list.table.reload(page);
    } else {
      setList(prevState => {
        prevState?.table.reload(page);
        return prevState;
      })
    }
  }, [list]);


  const getRegions = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
      setRegionList(resp.data || []);
    }).catch((err) => {
      console.log(err);
    });
  }, []);



  const init = useCallback(() => {
    let url = "facility/list"
    let payload: any = {}

    if (selectedRegions.length > 0) {
      payload.regions = selectedRegions.map((item: any) => item?.name)
    }

    if (status?.current !== "") {
      payload.is_active = status?.current
    }
    if (value.current instanceof Array) {
      if (value.current[1]) {
        payload.start_date = value.current[0]
        payload.end_date = value.current[1]
      } else {
        payload.start_date = value.current[0]
        payload.end_date = value.current[0]

      }

    }
    const options = new TsDataListOptions({
      extraPayload: payload,
      webMatColumns: role === "super_admin" ?
        ['Created On', "Facility Name", "Region", "Contact Number", 'Active / Inactive', "Actions"] : ['Created On', "Facility Name", "Region", "Contact Number", 'Status', "Actions"],
      mobileMatColumns: role === "super_admin" ? ['Created On', "Facility Name", "Region", "Contact Number", 'Active / Inactive', "Actions"] :
        ['Created On', "Facility Name", "Region", "Contact Number", 'Status', "Actions"],
    },
      ENV.API_URL + url, setList, ApiService, "post");
    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
  }, [role, selectedRegions]);

  const clearFilterValues = useCallback(() => {
    region.current = ""
    status.current = ""
    value.current = null
    selectedRegions.length = 0
  }, [selectedRegions])

  const openFilters = useCallback((index: any) => {
    clearFilterValues()
    setOpen(true)
  }, [clearFilterValues])

  const cancelopenFilters = useCallback(() => {
    setOpen(false)
  }, [])

  const resetFilters = useCallback(() => {
    clearFilterValues()
    init()
  }, [init, clearFilterValues])

  const confirmopenFilters = useCallback(() => {
    init()
    setOpen(false)
  }, [init])

  const handletoggleStatus = useCallback((id: any, is_active) => {
    let payload = {
      is_active: !is_active
    }
    CommonService._api.put(ENV.API_URL + 'facility/' + id, payload).then((resp) => {
      onReload()
    }).catch((err) => {
      console.log(err)
    })
  }, [onReload])

  useEffect(() => {
    init();
    getRegions()
    Communications.pageTitleSubject.next("Facility Management");
    Communications.pageBackButtonSubject.next(null);
  }, [init, getRegions]);

  return (
    <>
      <div className={"facility-list screen crud-layout pdd-30"}>
        {list && list.table?._isDataLoading && (
          <div className="table-loading-indicator">
            <LinearProgress />
          </div>
        )}
        <DialogComponent class={'dialog-side-wrapper'} open={open} cancel={cancelopenFilters}>
          <FacilityFiltersComponent
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            resetFilters={resetFilters}
            cancel={cancelopenFilters}
            confirm={confirmopenFilters}
            setRegionRef={setRegionRef}
            setStatusRef={setStatusRef}
            regionList={regionList}
            setValueRef={setValueRef}
            status={status}
            region={region}
            value={value} />
        </DialogComponent>
        <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0">
          <div className="header">
            <div className="mrg-left-5 filter">
              <div className="position-relative">
                <div style={{ position: 'absolute', top: '9px', left: '220px' }}>
                  <SearchRounded className="search-icon" />
                </div>
                <div>
                  <CssTextField defaultValue={''} onChange={event => {
                    if (list && list.table) {
                      list.table.filter.search = event.target.value;
                      list.table.reload();
                      list?.table.pageEvent(0)
                    }
                  }} className="searchField"
                    variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Facility'} />
                </div>
              </div>
            </div>
            <div className="action pdd-right-5 d-flex">
              <div>
                <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
              </div>
              <div className="mrg-left-20">
                <AccessControlComponent role={[ACCOUNTMANAGER, ADMIN]}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    component={Link}
                    to={`/facility/add`}
                  >
                    <AddRounded />
                    &nbsp;&nbsp;Add Facility&nbsp;&nbsp;
                  </Button>

                </AccessControlComponent>
              </div>
            </div>
          </div>
          {list && list.table && (
            <>
              <TableContainer component={Paper} className={"table-responsive"}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {list?.table.matColumns.map(
                        (column: any, columnIndex: any) => (
                          <TableCell
                            className={classesFunction(column)}
                            key={"header-col-" + columnIndex}
                          >
                            {column}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.table.canShowNoData() &&
                      <NoDataCardComponent tableCellCount={list.table.matColumns.length} />
                    }
                    {list?.table.data.map((row: any, rowIndex: any) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={"row-" + rowIndex}
                        >
                          <TableCell className="pdd-left-20">
                            {moment(row['created_at']).format("MM-DD-YYYY")}
                          </TableCell>
                          <TableCell>{row["facility_name"]}</TableCell>
                          <TableCell>{row?.address["region_name"]}</TableCell>
                          <TableCell>{row["phone_number"]}</TableCell>
                          {
                            role === "super_admin" ? <TableCell style={{ textAlign: "center" }}> <FormControlLabel
                              control={<Switch checked={row['is_active']} onChange={() => handletoggleStatus(row['_id'], row['is_active'])} />}
                              label={''}
                            /> </TableCell> : <TableCell>{row['is_active'] ? 'Active' : 'Inactive'}</TableCell>
                          }
                          <TableCell className="text-right mrg-right-10">
                            <Link
                              to={"/facility/tabs/" + row?._id}
                              className="info-link "
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
};

export default FacilityManagementListScreen;
