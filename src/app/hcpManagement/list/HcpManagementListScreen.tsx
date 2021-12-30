import React, { useEffect, useCallback, useState, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../constants";
import { ApiService, Communications } from "../../../helpers";
import { AddRounded } from "@material-ui/icons";
import { SearchRounded } from "@material-ui/icons";
import './HcpManagementListScreen.scss';
import { Button, LinearProgress } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import AccessControlComponent from '../../../components/AccessControl';
import CommonService, { HUMANRESOURCE, ADMIN } from '../../../helpers/common-service';
import FilterListIcon from '@material-ui/icons/FilterList';
import NoDataCardComponent from '../../../components/NoDataCardComponent';
import moment from 'moment';
import DialogComponent from '../../../components/DialogComponent';
import HcpFiltersComponent from '../filters/HcpFiltersComponent';
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

const HcpManagementListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const hcpType = useRef<any>("")
    const status = useRef<any>("")
    const value = useRef<any>(null)
    const [selectedHcpTypes, setSelectedHcpTypes] = useState<any>([])
    
    const classesFunction = useCallback((type:any)=>{
        if(type==="Actions"){
          return "last-row"
        }else if(type==="Created On"){
          return 'pdd-left-20 first-row'
        }
    },[])
    
    const setStatusRef = (val: any) => {
        status.current = val
    }

    const setHcpTypeRef = (val: any) => {
        hcpType.current = val
    }

    const setValueRef = (val: any) => {
        value.current = val
    }

    const getHcpTypes = useCallback(() => {
        CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
            setHcpTypes(resp.data || []);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const init = useCallback(() => {
        let url = "hcp/list"
        let payload: any = {}
        payload.is_approved = 0;

        if (selectedHcpTypes.length > 0) {
            payload.hcp_type = selectedHcpTypes.map((item: any) => item?.name)
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
            webMatColumns: ['Created On', 'Name', 'Contact Number', 'Email', 'Applied For', 'Actions'],
            mobileMatColumns: ['Created On', 'Name', 'Contact Number', 'Email', 'Applied For', 'Actions'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [selectedHcpTypes])

    const clearFilterValues = useCallback(() => {
        hcpType.current = ""
        status.current = ""
        value.current = null
        selectedHcpTypes.length = 0
    }, [selectedHcpTypes])

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

    useEffect(() => {
        init();
        getHcpTypes()
        Communications.pageTitleSubject.next('HCP Onboarding');
        Communications.pageBackButtonSubject.next(null);
    }, [init, getHcpTypes])

    return (
        <>
            <div className={'hcp-list screen crud-layout pdd-30'}>
                {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                    <LinearProgress />
                </div>}
                <DialogComponent class={'dialog-side-wrapper'} open={open} cancel={cancelopenFilters}>
                    <HcpFiltersComponent
                        resetFilters={resetFilters}
                        cancel={cancelopenFilters}
                        confirm={confirmopenFilters}
                        hcpTypes={hcpTypes}
                        setStatusRef={setStatusRef}
                        setValueRef={setValueRef}
                        status={status}
                        setHcpTypeRef={setHcpTypeRef}
                        hcpType={hcpType}
                        setSelectedHcpTypes={setSelectedHcpTypes}
                        selectedHcpTypes={selectedHcpTypes}
                        value={value} />
                </DialogComponent>
                <div className="custom-border pdd-10  pdd-top-20 pdd-bottom-0">
                    <div className="header">
                        <div className="mrg-left-5 filter">
                            <div className="position-relative  d-flex">
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
                                        variant={"outlined"} size={"small"} type={'text'} placeholder={'Search HCP'} />
                                </div>
                            </div>
                        </div>
                        <div className="action d-flex">
                            <div>
                                <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                            </div>
                            <div className='mrg-left-20'>
                                <AccessControlComponent role={[HUMANRESOURCE, ADMIN]} >
                                    <Button variant={"contained"} color={"primary"} component={Link} to={`/hcp/add`}>
                                        <AddRounded />&nbsp;&nbsp;Add HCP&nbsp;&nbsp;
                                    </Button>
                                </AccessControlComponent>
                            </div>
                        </div>
                    </div>
                    {list && list.table && <>
                        <TableContainer component={Paper} className={'table-responsive'} >
                            <Table stickyHeader aria-label="sticky table" style={{ tableLayout: "fixed" }}>
                                <TableHead>
                                    <TableRow>
                                        {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                            <TableCell  className={classesFunction(column)}
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={'row-' + rowIndex}>
                                                <TableCell>
                                                    {moment(row['created_at']).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    {row['first_name']}&nbsp;{row['last_name']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['contact_number']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['email']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_type']}
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

export default HcpManagementListScreen;