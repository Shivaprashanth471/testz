import React, { useCallback, useEffect, useState } from 'react';
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
import { Button, TextField, Tooltip } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import LoaderComponent from '../../../../components/LoaderComponent';
import "./AddHcpToExistingGroupScreen.scss";
import Checkbox from '@material-ui/core/Checkbox';

const AddHcpToExistingGroupScreen = () => {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [list, setList] = useState<TsDataListState | any>(null);
    const [title, setTitle] = useState<any>(null);
    const [selectedHcps, setSelectedHcps] = useState<any>(null)
    const [isAllselected, setAllSelected] = useState<boolean>(false);
    const [groupDetails, setGroupDetails] = useState<any>(null);
    const history = useHistory();
    const [groupHcps, setGroupHcps] = useState<any>(null);
    const [finalHcps, setFinalHcps] = useState<any>(null);
    const [isMembersAdded, setIsMembersAdded] = useState<boolean>(false)
    const init = useCallback(() => {
        let payload: any = {}
        payload.is_approved = 1;
        if (!list) {
            const options = new TsDataListOptions({
                extraPayload: payload,
                webMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
                mobileMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
            }, ENV.API_URL + "hcp/list", setList, ApiService, 'post');

            let tableWrapperObj = new TsDataListWrapperClass(options)
            setList({ table: tableWrapperObj });
        }

    }, [list]);

    const getGroupHcps = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'group/' + id + '/member').then((resp) => {
            setGroupHcps(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id]);


    const handleSelectHcp = (event: any, index: any) => {
        selectedHcps[index].checked = event.target.checked
        setSelectedHcps([...selectedHcps])
    }

    const handleSelectAll = (event: any) => {
        selectedHcps?.map((item: any) => {
            return (
                item.checked = event.target.checked
            )
        })
        setSelectedHcps(selectedHcps)
        setAllSelected(event.target.checked)
    }

    const getDetails = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'group/' + id).then((resp) => {
            setGroupDetails(resp.data);
            setTitle(resp.data.title)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])


    const AddHcpsToGroup = useCallback((hcp: any, group_id: any) => {
        delete hcp["checked"];
        return new Promise((resolve, reject) => {
            setIsMembersAdded(true)
            ApiService.post(ENV.API_URL + 'group/' + group_id + '/member', hcp).then((resp: any) => {
                if (resp && resp.success) {
                    resolve(null);
                    history.push('/group/view/' + group_id);
                    setIsMembersAdded(false)
                } else {
                    reject(resp);
                    setIsMembersAdded(false)
                }
            }).catch((err) => {
                reject(err);
            })
        })
    }, [history])

    const addHcps = useCallback((facilityId: string) => {
        (selectedHcps || []).forEach((value: any) => {
            if (value?.checked === true) {
                AddHcpsToGroup(value, facilityId)
            }
        })
    }, [selectedHcps, AddHcpsToGroup])

    const EditGroupTitle = useCallback((group_name: any) => {
        let payload = {
            title: group_name
        }
        CommonService._api.put(ENV.API_URL + 'group/' + id, payload).then((resp) => {
            if (resp && resp.success) {
                history.push('/group/view/' + id);
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [id, history])

    const onAdd = () => {
        addHcps(id);
        if (title !== groupDetails?.title) {
            EditGroupTitle(title)
        }
    }
    useEffect(() => {
        let temp: any = []
        finalHcps?.forEach((item: any) => {
            item = { hcp_user_id: item?.user_id, hcp_name: item?.first_name + ' ' + item?.last_name, hcp_type: item?.hcp_type, checked: false }
            temp.push(item)
        })
        setSelectedHcps(temp)
    }, [finalHcps])

    useEffect(() => {

    }, [isAllselected])

    useEffect(() => {
        init();
        getDetails()
        getGroupHcps()
        Communications.pageTitleSubject.next('Edit Group');
        Communications.pageBackButtonSubject.next('/group/list');
    }, [init, getDetails, getGroupHcps])

    useEffect(() => {
        let temp: any = []
        for (let i = 0; i < list?.table?.data?.length; i++) {
            let same = true;
            for (let j = 0; j < groupHcps?.length; j++) {
                if (list?.table?.data[i]?.user_id === groupHcps[j]?.hcp_user_id) {
                    same = false;
                    break;
                }
            }
            if (same === true) {
                temp.push(list?.table?.data[i])
            }
        }
        setFinalHcps(temp)

    }, [list?.table?.data, groupHcps])

    return (<>
        <div className={'add-member-group screen crud-layout pdd-30'}>
            {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                <LoaderComponent />
            </div>}
            <div>
                <div className="title custom-border pdd-top-20">
                    <div>
                        {groupDetails && <TextField className="group-title" variant="standard" fullWidth value={title} placeholder="Please enter the group title" onChange={(event) => setTitle(event?.target.value)} id="input-edit-group" />
                        } </div>
                </div>
                <div>
                    <div className="header mrg-top-0">
                        <div className="actions">
                            <div className="">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mrg-top-20 custom-border padding">
                {list && list.table && <>
                    <TableContainer component={Paper} className={'table-responsive'}>
                        <Table stickyHeader className="mat-table table add-members-group-list-table">
                            <TableHead className={"mat-thead"}>
                                <TableRow className={"mat-tr"}>
                                    <TableCell padding="checkbox" className="mat-th">
                                        <Checkbox onChange={(event) => handleSelectAll(event)} checked={isAllselected} id={"select-all-cb"} />
                                    </TableCell>

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
                                {finalHcps && finalHcps?.map((row: any, rowIndex: any) => {
                                    return (
                                        <TableRow role="checkbox" tabIndex={-1} key={'row-' + rowIndex} className='mat-tr'>
                                            <TableCell className="mat-td mat-td-checkbox">
                                                <Checkbox checked={selectedHcps[rowIndex]?.checked} onChange={(event) => handleSelectHcp(event, rowIndex)} id={"cb_" + rowIndex} />
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-hcp-name">
                                                {row['first_name']} &nbsp; {row['last_name']}
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-hcp-type">
                                                {row['hcp_type']}
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-sticky mat-td-actions">
                                                <Tooltip title={`View  ${row['first_name']} ${row['last_name']} Details`}>
                                                    <Link to={{pathname:'/hcp/user/view/' + row?.user_id,state:{prevPath:"/group/edit/member/"+id}}} className="info-link" id={"link_facility_details" + rowIndex} >
                                                        {('View Details')}
                                                    </Link>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>}
            </div>
            <div className="button-wrapper">
                <Tooltip title={`Back to ${groupDetails?.title} View details`}>
                    <Button component={Link} variant={"outlined"} className={'normal pdd-left-40 pdd-right-40'} to={'/group/view/' + id} color={"primary"}>Back</Button>
                </Tooltip>
                <Tooltip title={`Add Members to ${groupDetails?.title}`}>
                    <Button variant={"contained"} color={"primary"} className={isMembersAdded ? "add-button mrg-left-20 has-loading-spinner" : "add-button mrg-left-20"} onClick={onAdd} disabled={isMembersAdded}>
                        {isMembersAdded ? "Adding Members" : "Add Members"}</Button>
                </Tooltip>
            </div>
        </div>
    </>
    )
}

export default AddHcpToExistingGroupScreen;
