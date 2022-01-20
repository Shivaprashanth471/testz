import React, { useEffect, useCallback, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../../constants";
import { ApiService, CommonService, Communications } from "../../../../helpers";
import { AddRounded, DeleteForeverOutlined } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { Link, useParams, useHistory } from "react-router-dom";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from "@material-ui/core/IconButton";
import './GroupViewScreen.scss';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import DialogComponent from '../../../../components/DialogComponent';
import VitawerksConfirmComponent from '../../../../components/VitawerksConfirmComponent';
import LoaderComponent from '../../../../components/LoaderComponent';

const GroupViewScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const [editGroup, setEditGroup] = useState<null | HTMLElement>(null);
    const openEditGroupOptions = Boolean(editGroup);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [isGroupOpen, setIsGroupOpen] = useState<boolean>(false);
    const [isConfirmDelete,setIsConfirmDelete] = useState<boolean>(false);
    const history = useHistory();
    const ITEM_HEIGHT = 48;
    const [groupDetails, setGroupDetails] = useState<any>(null);
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [removeMemberDetails, setRemoveMemberDetails] = useState<any>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setEditGroup(event.currentTarget);
    };

    const handleSmsBlast = (group: any) => {
        history.push({
            pathname: "/sendSmsBlast",
            state: group
        })
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

    const handleClose = useCallback(() => {
        setEditGroup(null);
    }, [])

    const handleRemoveMembers = () => {
        history.push(`/group/remove/` + id)
    }

    const getDetails = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'group/' + id).then((resp) => {
            setGroupDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const init = useCallback(() => {
        if (!list) {
            const options = new TsDataListOptions({
                webMatColumns: ['HCP Name', 'HCP Type', 'Remove', 'Actions'],
                mobileMatColumns: ['HCP Name', 'HCP Type', 'Remove', 'Actions'],
            }, ENV.API_URL + 'group/' + id + '/member', setList, ApiService, 'get');

            let tableWrapperObj = new TsDataListWrapperClass(options)
            setList({ table: tableWrapperObj });
        }
    }, [list, id]);

    const handleRemove = useCallback(() => {
        CommonService._api.delete(ENV.API_URL + 'group/' + id + '/member/' + removeMemberDetails?._id).then((resp) => {
            onReload(1)
            setIsConfirmDelete(false)
            setIsAddOpen(false);
        }).catch((err) => {
            console.log(err)
            setIsConfirmDelete(false)
        })
    }, [id, onReload, removeMemberDetails?._id])

    const handleDeleteGroup = useCallback(() => {
        CommonService._api.delete(ENV.API_URL + 'group/' + id).then((resp) => {
            handleClose()
            history.push('/group/list')
            setIsGroupOpen(false);
            setIsConfirmDelete(false)
        }).catch((err) => {
            setIsConfirmDelete(false)
            console.log(err)
        })
    }, [id, history, handleClose])

    useEffect(() => {
        init();
        getDetails()
        Communications.pageTitleSubject.next('Create Details');
        Communications.pageBackButtonSubject.next('/group/list');
    }, [init, getDetails])

    const openAdd = useCallback((id: any, index: any) => {
        console.log(list?.table?.data[index])
        setRemoveMemberDetails(list?.table?.data[index])
        setIsAddOpen(true);
    }, [list?.table?.data, setRemoveMemberDetails])

    const cancelAdd = useCallback(() => {
        setIsAddOpen(false);
    }, [])

    const confirmAdd = useCallback(() => {
        setIsConfirmDelete(true)
        handleRemove()
        init()
    }, [init, handleRemove])

    const openDeleteGroup = useCallback(() => {
        setIsGroupOpen(true);
    }, [])

    const cancelDeleteGroup = useCallback(() => {
        setIsGroupOpen(false);
    }, [])

    const confirmDeleteGroup = useCallback(() => {
        setIsConfirmDelete(true)
        handleDeleteGroup()
    }, [handleDeleteGroup])

    return (
        <>
            <div className={'group-view screen crud-layout pdd-30'}>
                {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                    <LoaderComponent />
                </div>}
                <DialogComponent open={isAddOpen} cancel={cancelAdd}>
                    <VitawerksConfirmComponent cancel={cancelAdd} confirm={confirmAdd} text1='Remove' hcpname={removeMemberDetails?.hcp_name} groupname={groupDetails?.title} confirmationText={'from'} notext={"Cancel"} yestext={"Remove"} isConfirm={isConfirmDelete}/>
                </DialogComponent>
                <DialogComponent open={isGroupOpen} cancel={cancelDeleteGroup}>
                    <VitawerksConfirmComponent cancel={cancelDeleteGroup} confirm={confirmDeleteGroup} text1='Delete' hcpname={groupDetails?.title} groupname={''} confirmationText={'Group'} notext={"Cancel"} yestext={"Delete"}  isConfirm={isConfirmDelete}/>
                </DialogComponent>
                <div>
                    <div className="header mrg-bottom-0 custom-border pdd-top-30 pdd-bottom-10">
                        <div className="filter">
                            <div>
                                <h2>{groupDetails?.title}</h2>
                                <p>Total Members:{list?.table?.data?.length}</p>
                            </div>
                        </div>
                        <div className="actions">
                            <Button variant={"outlined"} className={'normal mrg-right-20'} color={"primary"} onClick={() => handleSmsBlast(groupDetails)} id="btn-send-sms-blast">
                                Send SMS Blast
                            </Button>
                            <Button variant={"outlined"} className={'normal'} color={"primary"} component={Link} to={`/group/edit/member/` + id} id="btn-add-new-hcp">
                                <AddRounded />&nbsp;&nbsp;Add New
                            </Button>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                                id="group-long-menu"
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={editGroup}
                                keepMounted
                                open={openEditGroupOptions}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                        marginTop: "30px"
                                    },
                                }}
                            >
                                <MenuItem key={"delete-group"} onClick={() => openDeleteGroup()} id="btn-delete-group">
                                    {'Delete Group'}
                                </MenuItem>
                                <MenuItem onClick={handleRemoveMembers} key={"remove-members"} remove-memid="btn-ber">
                                    {'Remove Members'}
                                </MenuItem>
                            </Menu>

                        </div>
                    </div>
                </div>
                <div className="mrg-top-40 custom-border pdd-0">
                    {list && list.table && <>
                        <TableContainer component={Paper} className={'table-responsive'}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                            <TableCell className={(column === 'HCP Name') ? 'pdd-left-20' : ''}
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={'row-' + 1}>
                                                <TableCell className="pdd-left-20">
                                                    {row['hcp_name']}
                                                </TableCell>
                                                <TableCell>
                                                    {row['hcp_type']}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="d-flex message-wrapper" onClick={() => openAdd(row._id, rowIndex)} id={"btn-remove-hcp-" + rowIndex}>
                                                        <DeleteForeverOutlined className="remove" /> &nbsp; <span className="remove">Remove</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell >
                                                    <Link to={'/hcp/user/view/' + row?.hcp_user_id} className="info-link" id={"link_hcp_details_" + rowIndex} >
                                                        {('View Details')}
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>}
                </div>
            </div>
        </>
    )
}

export default GroupViewScreen;