import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../../classes/ts-data-list-wrapper.class';
import { ENV } from '../../../../../constants';
import { ApiService, CommonService } from '../../../../../helpers';
import './PendingHcpApplicationComponent.scss'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import { LinearProgress, IconButton } from "@material-ui/core";
import { StateParams } from '../../../../../store/reducers';
import { useSelector } from 'react-redux';
import RejectHcpApplicationComponent from '../rejectHcp/RejectHcpApplicationComponent';
import DialogComponent from "../../../../../components/DialogComponent";
import moment from 'moment';
import NoDataCardComponent from '../../../../../components/NoDataCardComponent';
import CreateShiftScreen from '../approved/createShift/CreateShiftScreen';


export interface PendingHcpApplicationComponentProps {
    isAddOpen: Boolean;
    status: string;
}

const PendingHcpApplicationComponent = (props: PropsWithChildren<PendingHcpApplicationComponentProps>) => {
    const status = props?.status;
    const isAddOpen = props?.isAddOpen
    const param = useParams<any>()
    const { id } = param
    const [list, setList] = useState<TsDataListState | null>(null);
    const { user } = useSelector((state: StateParams) => state.auth);
    const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
    const [isApproveOpen, setIsApproveOpen] = React.useState<boolean>(false);
    const [applicationId, setApplicationId] = useState<string>('')
    const [hcpId, setHcpId] = useState<string>('')
    const init = useCallback(() => {
        const options = new TsDataListOptions({
            webMatColumns: ['HCP Name', 'Email', 'Applied On', 'HCP Type', 'HCP Rate', 'Action'],
            mobileMatColumns: ['HCP Name', 'Email', 'Applied On', 'HCP Type', 'HCP Rate', 'Action'],
        }, ENV.API_URL + 'shift/requirement/' + id + '/application?status=pending', setList, ApiService, 'get');
        let tableWrapperObj = new TsDataListWrapperClass(options)
        setList({ table: tableWrapperObj });
    }, [id])

    const cancelApprove = useCallback(() => {
        setIsApproveOpen(false);
    }, [])


    const confirmApprove = useCallback(() => {
        setIsApproveOpen(false);
        init()
    }, [init])

    const openApprove = useCallback((hcpId: string, applicationId: string) => {
        console.log(hcpId, applicationId)
        setHcpId(hcpId)
        setApplicationId(applicationId)
        setIsApproveOpen(true);
    }, [])

    // const openRejectApplication=useCallback(()=>{
    //     setIsRejectOpen(true)
    // },[])

    const cancelRejectApplication = useCallback(() => {
        setIsRejectOpen(false)
    }, [])

    const confirmRejectApplication = useCallback(() => {
        setIsRejectOpen(false)
    }, [])

    useEffect(() => {
        init()
    }, [init, isAddOpen])

    const handleRejectHcp = useCallback((application_id: any) => {
        let payload = { "approved_by": user?._id }
        CommonService._api.patch(ENV.API_URL + 'shift/requirement/' + id + '/application/' + application_id + '/reject', payload).then((resp) => {
            init()
        }).catch((err) => {
            console.log(err)
            CommonService.showToast(err.error || 'Error', 'error');
        })
    }, [id, user?._id, init])


    return <div className='pending-hcps-list'>
        {list && list.table?._isDataLoading && <div className="table-loading-indicator">
            <LinearProgress />
        </div>}
        <DialogComponent open={isRejectOpen} cancel={cancelRejectApplication}>
            <RejectHcpApplicationComponent cancel={cancelRejectApplication} confirm={confirmRejectApplication} />
        </DialogComponent>
        <DialogComponent open={isApproveOpen} cancel={cancelApprove}>
            <CreateShiftScreen hcpId={hcpId} cancel={cancelApprove} applicationId={applicationId} confirm={confirmApprove} />
        </DialogComponent>
        {list && list.table && <>
            <TableContainer component={Paper} className={'table-responsive'}>
                <Table stickyHeader aria-label="sticky table" style={{ tableLayout: "fixed" }}>
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
                                        {row['hcp_data']?.email}
                                    </TableCell>
                                    <TableCell>
                                        {moment(row['created_at']).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell>
                                        {row['hcp_data']?.hcp_type}
                                    </TableCell>
                                    <TableCell>
                                        {row['hcp_data']?.rate}
                                    </TableCell>
                                    <TableCell className='action-wrapper'>
                                        <div className="d-flex actions">
                                            <IconButton onClick={() => openApprove(row['hcp_user_id'], row['_id'])} disabled={status === "cancelled"}>
                                                <CheckIcon className="add-icon" />
                                            </IconButton>
                                            <IconButton onClick={() => handleRejectHcp(row['_id'])} disabled={status === "cancelled"}>
                                                <CancelIcon className="delete-icon" />
                                            </IconButton>
                                        </div>
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


export default PendingHcpApplicationComponent;