import React, { useEffect, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../../constants";
import { ApiService, CommonService, Communications } from "../../../../helpers";
import { Button, TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import './AddGroupScreen.scss';
import NoDataCardComponent from '../../../../components/NoDataCardComponent';
import LoaderComponent from '../../../../components/LoaderComponent';

const AddGroupScreen = () => {
    const [list, setList] = React.useState<TsDataListState | any>(null);
    const [title, setTitle] = React.useState<any>(null);
    const [selectedHcps, setSelectedHcps] = React.useState<any>(null)
    const [isAllselected, setAllSelected] = React.useState<boolean>(false);
    const [selectedCount, setSelectedCount] = React.useState<any>(-1)
    const history = useHistory();

    const init = useCallback(() => {
        let payload: any = {}
        payload.is_approved = 1;
        if (!list) {
            const options = new TsDataListOptions({
                extraPayload: payload,
                webMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
                mobileMatColumns: ['HCP Name', 'HCP Type', 'Actions'],
            }, ENV.API_URL + 'hcp/list', setList, ApiService, 'post');

            let tableWrapperObj = new TsDataListWrapperClass(options)
            setList({ table: tableWrapperObj });
        }

    }, [list]);

    const handleSelectHcp = (event: any, index: any) => {
        console.log(selectedHcps)
        setSelectedCount(1)
        selectedHcps[index].checked = event.target.checked
        setSelectedHcps([...selectedHcps])
    }

    const handleSelectAll = (event: any) => {
        selectedHcps?.forEach((item: any) => {
            item.checked = event.target.checked
        })
        setSelectedCount(1)
        setSelectedHcps(selectedHcps)
        setAllSelected(event.target.checked)
    }
    const AddHcpsToGroup = useCallback((hcp: any, group_id: any) => {
        delete hcp["checked"];
        console.log(hcp, "hcp")
        return new Promise((resolve, reject) => {
            ApiService.post(ENV.API_URL + 'group/' + group_id + '/member', hcp).then((resp: any) => {
                if (resp && resp.success) {
                    resolve(null);
                    history.push('/group/view/' + group_id);
                } else {
                    reject(resp);
                }
            }).catch((err) => {
                reject(err);
            })
        })
    }, [history])
    const addHcps = useCallback((groupId: string) => {
        if (selectedCount > -1) {
            (selectedHcps || []).forEach((value: any) => {
                if (value?.checked === true) {
                    AddHcpsToGroup(value, groupId)
                }
            })
        } else {
            history.push('/group/view/' + groupId);
        }
    }, [selectedHcps, AddHcpsToGroup, history, selectedCount])

    const onAdd = () => {
        let payload = {
            title: title
        }
        CommonService._api.post(ENV.API_URL + 'group', payload).then((resp) => {
            if (resp && resp.success) {
                const groupId = resp.data._id;
                addHcps(groupId);
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        let temp: any = []
        list?.table?.data?.forEach((item: any) => {
            console.log(item)
            item = { hcp_user_id: item?.user_id, hcp_name: item?.first_name + ' ' + item?.last_name, hcp_type: item?.hcp_type, checked: false }
            temp.push(item)
        })
        setSelectedHcps(temp)
    }, [list])

    useEffect(() => {

    }, [isAllselected])

    useEffect(() => {
        init();
        Communications.pageTitleSubject.next('Add Group');
        Communications.pageBackButtonSubject.next('/group/list');
    }, [init])


    return (
        <>
            <div className={'add-group screen crud-layout pdd-30'}>
                {list && list.table?._isDataLoading && <div className="table-loading-indicator">
                    <LoaderComponent />
                </div>}
                <div>
                    <div className="title custom-border pdd-top-20">
                        <TextField className="group-title" variant="standard" fullWidth value={title} placeholder="Please enter the group title" onChange={(event) => setTitle(event?.target.value)} id="input-add-group" />
                    </div>
                    <div>
                        <div className="header mrg-top-0">
                            <div className="filter">
                            </div>
                            <div className="actions">
                                <div className="">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {list && list.table && <>
                    <TableContainer component={Paper} className={'table-responsive'}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <input type="checkbox" onChange={(event) => handleSelectAll(event)} checked={isAllselected} id={"select-all-cb"} />
                                    </TableCell>

                                    {list?.table.matColumns.map((column: any, columnIndex: any) => (
                                        <TableCell className={(column === 'actions') ? 'min-width-cell' : ''}
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
                                                <input type={"checkbox"} id={"cb_" + rowIndex} checked={selectedHcps[rowIndex]?.checked} onChange={(event) => handleSelectHcp(event, rowIndex)} />
                                            </TableCell>
                                            <TableCell>
                                                {row['first_name']} &nbsp; {row['last_name']}
                                            </TableCell>
                                            <TableCell>
                                                {row['hcp_type']}
                                            </TableCell>
                                            <TableCell >
                                                <Link to={'/hcp/view/' + row?._id} className="info-link" id={"link_hcp_details" + rowIndex} >
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
                <div className="button-wrapper">
                    <Button variant={"contained"} className="add-button" color={"primary"} disabled={!title} onClick={onAdd}>Add To Group</Button>
                </div>
            </div>
        </>
    )
}

export default AddGroupScreen;