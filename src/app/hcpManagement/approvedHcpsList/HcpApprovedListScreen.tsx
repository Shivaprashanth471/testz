import { LinearProgress } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import moment from "moment";
import { SearchRounded } from "@material-ui/icons";
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../classes/ts-data-list-wrapper.class";
import NoDataCardComponent from '../../../components/NoDataCardComponent';
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import { StateParams } from '../../../store/reducers';
import { TextField } from "@material-ui/core";
import DialogComponent from "../../../components/DialogComponent";
import HcpFiltersComponent from "../filters/HcpFiltersComponent";
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

const HcpApprovedListScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const { role } = useSelector((state: StateParams) => state?.auth?.user);
    const [open, setOpen] = useState<boolean>(false);
    const [hcpTypes, setHcpTypes] = useState<any | null>(null);
    const hcpType = useRef<any>("")
    const status = useRef<any>("")
    const value = useRef<any>(null)
    const [selectedHcpTypes, setSelectedHcpTypes] = useState<any>([])


    const setStatusRef = (val: any) => {
        status.current = val
    }
    const setHcpTypeRef = (val: any) => {
        hcpType.current = val
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
        payload.is_approved = 1;

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
            webMatColumns: role === "super_admin" ? ['Created On', 'Name', 'Contact Number', 'Email', 'HCP Type', 'Active/Inactive', 'Action'] : ['Created On', 'Name', 'Contact Number', 'Email', 'HCP Type', 'Status', 'Action'],
            mobileMatColumns: role === "super_admin" ? ['Created On', 'Name', 'Contact Number', 'Email', 'HCP Type', 'Active/Inactive', 'Action'] : ['Created On', 'Name', 'Contact Number', 'Email', 'HCP Type', 'Status', 'Action'],
        }, ENV.API_URL + url, setList, ApiService, 'post');

        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [role, selectedHcpTypes])

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

    const handletoggleStatus = useCallback((id: any, is_active) => {
        let payload = {
            is_active: !is_active
        }
        CommonService._api.put(ENV.API_URL + 'hcp/' + id, payload).then((resp) => {
            onReload(Number(list?.table?.pagination?.pageIndex) + 1)
        }).catch((err) => {
            console.log(err)
        })
    }, [onReload, list?.table?.pagination?.pageIndex])

    const confirmopenFilters = useCallback(() => {
        init()
        setOpen(false)
    }, [init])

    useEffect(() => {
        init();
        getHcpTypes()
        Communications.pageTitleSubject.next('HCP Management');
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
                        showStatus={true}
                        selectedHcpTypes={selectedHcpTypes}
                        setSelectedHcpTypes={setSelectedHcpTypes}
                        resetFilters={resetFilters}
                        cancel={cancelopenFilters}
                        confirm={confirmopenFilters}
                        hcpTypes={hcpTypes}
                        setStatusRef={setStatusRef}
                        setValueRef={setValueRef}
                        status={status}
                        setHcpTypeRef={setHcpTypeRef}
                        hcpType={hcpType}
                        value={value} />
                </DialogComponent>
                <div className="header">
                    <div className="filter"></div>
                    <div className="action">

                    </div>
                </div>
                <div className="custom-border pdd-10 pdd-top-20 pdd-bottom-0">
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
                                    }} className = "searchField" variant={"outlined"} size={"small"} type={'text'} placeholder={'Search HCP'} />
                                </div>
                            </div>
                        </div>
                        <div className="action">
                            <FilterListIcon className={"mrg-top-5 filter-icon"} onClick={openFilters} />
                        </div>
                    </div>
                    {list && list.table && <>
                        <TableContainer component={Paper} className={'table-responsive'} >
                            <Table stickyHeader aria-label="sticky table" style={{ tableLayout: "fixed" }}>
                                <TableHead>
                                    <TableRow>
                                        {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                            <TableCell className={(column === 'Active/Inactive') ? 'text-align' : ''}
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
                                                {
                                                    role === "super_admin" ? <TableCell style={{ textAlign: "center" }}> <FormControlLabel
                                                        control={<Switch checked={row['is_active']} onChange={() => handletoggleStatus(row['_id'], row['is_active'])} />}
                                                        label={''}
                                                    /> </TableCell> :row['is_active'] ?  <TableCell style={{color:"#41D6C3"}}>Active</TableCell>:<TableCell style={{color:"#808080"}}> Inactive</TableCell>
                                                }
                                                <TableCell >
                                                    <Link to={'/hcp/user/view/' + row['user_id']} className="info-link" id={"link_hospital_details" + rowIndex} >
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

export default HcpApprovedListScreen;