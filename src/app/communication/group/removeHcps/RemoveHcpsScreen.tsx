import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from '../../../../classes/ts-data-list-wrapper.class';
import { ENV } from '../../../../constants';
import { ApiService, CommonService, Communications } from '../../../../helpers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from "@material-ui/core";
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import LoaderComponent from '../../../../components/LoaderComponent';
import "./RemoveHcpsScreen.scss";
import Checkbox from '@material-ui/core/Checkbox';

const RemoveHcpsScreen = () => {
    const [list, setList] = useState<TsDataListState | null>(null);
    const params = useParams<{ id: string }>();
    const { id } = params;
    const history = useHistory();
    const [selectedHcps, setSelectedHcps] = useState<any>(null)
    const [isAllselected, setAllSelected] = useState<boolean>(false);
    const [groupDetails, setGroupDetails] = useState<any>(null);
    const [isRemoveMembers,setIsRemoveMembers] = useState<boolean>(false);

    const init = useCallback(() => {
        if (!list) {
            const options = new TsDataListOptions({
                webMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
                mobileMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
            }, ENV.API_URL + 'group/' + id + '/member', setList, ApiService, 'get');

            let tableWrapperObj = new TsDataListWrapperClass(options)
            setList({ table: tableWrapperObj });
        }
    }, [list, id]);

    const RemoveHcpsToGroup = useCallback((hcp: any) => {
        delete hcp["checked"];
        return new Promise((resolve, reject) => {
            setIsRemoveMembers(true)
            ApiService.delete(ENV.API_URL + 'group/' + id + '/member/' + hcp?._id).then((resp: any) => {
                if (resp && resp.success) {
                    resolve(null);
                    history.push('/group/view/' + id);
                    setIsRemoveMembers(false)
                } else {
                    reject(resp);
                    setIsRemoveMembers(false)
                }
            }).catch((err) => {
                reject(err);
                setIsRemoveMembers(false)
            })
        })
    }, [history, id])

    const getDetails = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'group/' + id).then((resp) => {
            setGroupDetails(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const handleSelectAll = (event: any) => {
        selectedHcps?.map((item: any) => {
            return (
                item.checked = event.target.checked
            )
        })
        setSelectedHcps(selectedHcps)
        setAllSelected(event.target.checked)
    }

    const handleSelectHcp = (event: any, index: any) => {
        selectedHcps[index].checked = event.target.checked
        setSelectedHcps([...selectedHcps])
    }

    const handleRemoveMembers = useCallback(() => {
        setIsRemoveMembers(true);

        (selectedHcps || []).forEach((value: any) => {
            if (value?.checked === true) {
                RemoveHcpsToGroup(value)
            }
        })
    }, [selectedHcps, RemoveHcpsToGroup])

    useEffect(() => {
        let temp: any = []
        list?.table?.data?.forEach((item: any) => {
            item = { ...item, checked: false }
            temp.push(item)
        })
        setSelectedHcps(temp)
    }, [list])

    useEffect(() => {

    }, [isAllselected])


    useEffect(() => {
        init();
        getDetails()
        Communications.pageTitleSubject.next('Remove HCP');
        Communications.pageBackButtonSubject.next('/group/list');
    }, [init, getDetails])
    return (
        <>
            <div className={'group-view screen crud-layout pdd-30'}>
                {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                    <LoaderComponent />
                </div>}
                <div>
                    <div className="header mrg-bottom-0">
                        <div className="filter">
                            <div>
                                <h2>{groupDetails?.title}</h2>
                                <p>Total Members:{list?.table?.data?.length}</p>
                            </div>
                        </div>
                        <div className="actions">
                            <div className="">

                            </div>
                        </div>
                    </div>
                </div>
                {list && list.table && <>
                    <TableContainer component={Paper} className={'table-responsive'}>
                        <Table stickyHeader className="mat-table table remove-members-list-table">
                            <TableHead className={"mat-thead"}>
                                 <TableRow className={"mat-tr"}>
                                    <TableCell padding="checkbox" className="mat-th">
                                        <Checkbox onChange={(event) => handleSelectAll(event)} checked={isAllselected} id="cb_select_all_hcps" />
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
                                {list?.table.data.map((row: any, rowIndex: any) => {
                                    return (
                                        <TableRow className='mat-tr' role="checkbox" tabIndex={-1} key={'row-' + 1}>
                                            <TableCell className="mat-td mat-td-checkbox">
                                                <Checkbox checked={selectedHcps[rowIndex]?.checked} onChange={(event) => handleSelectHcp(event, rowIndex)} id={"cb_" + rowIndex} />
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-hcp-name">
                                                {row['hcp_name']}
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-hcp-type">
                                                {row['hcp_type']}
                                            </TableCell>
                                            <TableCell className="mat-td mat-td-sticky mat-td-actions">
                                                <Link to={{pathname:'/hcp/user/view/' + row?.hcp_user_id,state:{prevPath:"/group/remove/"+id}}} className="info-link" id={"link_hcp_details" + rowIndex} >
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
                <div className="mrg-top-20 remove-members-wrapper">
                   <div className="d-flex">
                   <Button
                        size="large"
                        onClick={() => history.push('/group/view/' + id)}
                        variant={"outlined"}
                        color="secondary"
                        className="cancel"
                        id="btn_hcp_edit_cancel">Cancel</Button>
                    <Button variant={"contained"} disabled={isRemoveMembers} className={isRemoveMembers?"actions has-loading-spinner":"actions"} onClick={handleRemoveMembers} color={"primary"}>{isRemoveMembers?"Removing Members":"Remove Members"}</Button>
                   </div>
                </div>
            </div>
        </>
    )
}


export default RemoveHcpsScreen;