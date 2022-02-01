import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../../classes/ts-data-list-wrapper.class';
import { ENV } from '../../../../../constants';
import { ApiService } from '../../../../../helpers';
import './PendingHcpApplicationComponent.scss'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import { LinearProgress, IconButton } from "@material-ui/core";
import DialogComponent from "../../../../../components/DialogComponent";
import moment from 'moment';
import NoDataCardComponent from '../../../../../components/NoDataCardComponent';
import RejectHcpApplicationComponent from '../../../pending/rejectHcp/RejectHcpApplicationComponent';
import CreateShiftScreen from '../../../pending/createShift/CreateShiftScreen';

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
    const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
    const [isApproveOpen, setIsApproveOpen] = React.useState<boolean>(false);
    const [applicationId, setApplicationId] = useState<string>('');
    const [hcpId, setHcpId] = useState<string>('');

    const init = useCallback(() => {
        const options = new TsDataListOptions({
            webMatColumns: ['HCP Name', 'Email', 'Applied On', 'HCP Type', 'HCP Rate', 'Actions'],
            mobileMatColumns: ['HCP Name', 'Email', 'Applied On', 'HCP Type', 'HCP Rate', 'Actions'],
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

    useEffect(() => {
        init()
    }, [init, isAddOpen])

    const openRejectApplication = useCallback((applicationId: any) => {
        setApplicationId(applicationId)
        setIsRejectOpen(true)
    }, [])

    const cancelRejectApplication = useCallback(() => {
        setIsRejectOpen(false)
    }, [])

    const confirmRejectApplication = useCallback(() => {
        setIsRejectOpen(false)
        init()
    }, [init])

    return <div className='pending-shift-applications-hcps-list'>
        {list && list.table?._isDataLoading && <div className="table-loading-indicator">
            <LinearProgress />
        </div>}
        <DialogComponent open={isRejectOpen} cancel={cancelRejectApplication}>
            <RejectHcpApplicationComponent cancel={cancelRejectApplication} confirm={confirmRejectApplication} requirementId={id} applicationId={applicationId} />
        </DialogComponent>
        <DialogComponent open={isApproveOpen} cancel={cancelApprove}>
            <CreateShiftScreen hcpId={hcpId} cancel={cancelApprove} applicationId={applicationId} confirm={confirmApprove} requirementId={id} />
        </DialogComponent>
        {list && list.table && <>
            <TableContainer component={Paper} className={'table-responsive'}>
                <Table stickyHeader className="mat-table table shifts-requirment-pending-list-table">
                    <TableHead className={"mat-thead"}>
                         <TableRow className={"mat-tr"}>
                            {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                <TableCell className={column === "Actions" ? "mat-th mat-th-sticky" : "mat-th"}
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
                                <TableRow className='mat-tr' role="checkbox" tabIndex={-1} key={'row-'}>
                                    <TableCell className="mat-td mat-td-hcp-name">
                                        {row['hcp_data']?.first_name}&nbsp;{row['hcp_data']?.last_name}
                                    </TableCell>
                                    <TableCell className="mat-td mat-td-hcp-email">
                                        {row['hcp_data']?.email}
                                    </TableCell>
                                    <TableCell className="mat-td mat-td-created-at">
                                        {moment(row['created_at']).format("DD-MM-YYYY")}
                                    </TableCell>
                                    <TableCell className="mat-td mat-td-hcp-type">
                                        {row['hcp_data']?.hcp_type}
                                    </TableCell>
                                    <TableCell className="mat-td mat-td-hcp-rate">
                                        {row['hcp_data']?.rate}
                                    </TableCell>
                                    <TableCell className="mat-td mat-td-sticky mat-td-actions">
                                        <div className="d-flex action-wrapper">
                                            <IconButton onClick={() => openApprove(row['hcp_user_id'], row['_id'])} disabled={status === "cancelled"}>
                                                <CheckIcon className="add-icon" />
                                            </IconButton>
                                            <IconButton onClick={() => openRejectApplication(row['_id'])} disabled={status === "cancelled"}>
                                                <CancelIcon className="delete-icon" />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>}
    </div>;
}


export default PendingHcpApplicationComponent;