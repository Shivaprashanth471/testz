import React, {useCallback, useEffect, useState} from 'react';
import {Colors, ENV} from '../../constants';
import {CommonService, Communications} from '../../helpers';
import NotificationCardComponent from './cards/NotificationCardComponent';
import moment from "moment";
import {useHistory} from "react-router-dom";
import {markAllNotificationRead, markNotificationRead} from "../../store/actions/polling.action";
import {useDispatch, useSelector} from "react-redux";
import {StateParams} from "../../store/reducers";
import {Button} from "@material-ui/core";
import './NotificationScreen.scss';

// const dummyData = [
//     {
//         uid:9999,
//         student_name:"Srikar",
//         emotion_aggregate:70,
//         timestamp:"10 mins ago",
//         emotion_name:"Anger",
//     },
//     {
//         uid:9999,
//         student_name:"Santhosh",
//         emotion_name:"Sadness",
//         emotion_aggregate:50,
//         timestamp:"1 hour ago"
//     },
//     {
//         uid:9999,
//         student_name:"Swetha",
//         emotion_aggregate:60,
//         emotion_name:"Fear",
//         timestamp:"1 hour ago"
//     },
//     {
//         uid:9999,
//         student_name:"Santhosh",
//         emotion_aggregate:50,
//         emotion_name:"Anger",
//         timestamp:"1 hour ago"
//     },
//     {
//         uid:9999,
//         student_name:"Swetha",
//         emotion_aggregate:60,
//         emotion_name:"disgust",
//         timestamp:"1 hour ago"
//     },
//     {
//         uid:9999,
//         student_name:"Pratteek",
//         emotion_aggregate:55,
//         emotion_name:"Sadness",
//         timestamp:"1 day ago"
//     },
//     {
//         uid:9999,
//         student_name:"Pranay",
//         emotion_name:"Fear",
//         emotion_aggregate:90,
//         timestamp:"1 week ago"
//     },
// ];

const NotificationScreen = () => {

    const history = useHistory();
    const [list, setList] = useState<any | null>(null);
    const {lastCheckedTime} = useSelector((state: StateParams) => state.polling)
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState<any>(null);

    const readAllNotifications = useCallback(() => {
        dispatch(markAllNotificationRead(lastCheckedTime || new Date().toString()));
    }, [lastCheckedTime, dispatch]);

    const getNotificationsList = useCallback((page = 1, limit = 10) => {
        console.log(pagination)

        const start_date = moment().subtract(1, 'year').format('YYYY-MM-DD');
        const end_date = moment().format('YYYY-MM-DD');
        const payload = {start_date, end_date, page, limit};
        CommonService._api.post(ENV.API_URL + 'notification/list', payload).then((resp) => {
            if (resp && resp.success) {
                // console.log(resp.data.docs);
                const {docs, ...pagination} = resp.data;
                setList(docs || []);
                // delete resp.data.docs;
                setPagination(pagination);
            } else {
                console.log("error");
                setList(null);
                setPagination({
                    page: 1,
                    limit: 10,
                    pages: 1,
                    total: 0
                });
            }
        }).catch((err) => {
            console.log(err);
            setList(null);
            setPagination({
                page: 1,
                limit: 10,
                pages: 1,
                total: 0
            });
        })
    }, [pagination]);

    useEffect(() => {
        getNotificationsList();
        Communications.pageTitleSubject.next('Notifications');
        Communications.pageBackButtonSubject.next(null);
    }, [getNotificationsList]);
    const openNotification = useCallback(({
                                              domain_id,
                                              student_master_id,
                                              script_id,
                                              session_id,
                                              subdomain_id,
                                              ...item
                                          }: any) => {
        console.log({
            domain_id,
            student_master_id,
            script_id,
            session_id,
            subdomain_id, ...item
        });
        dispatch(markNotificationRead(item._id));
        history.push('/student/view/' + student_master_id, {domain_id, session_id, script_id, module_id: subdomain_id});
    }, [history, dispatch])

    return (
        <div className={"notifications-list-screen screen mrg-top-20"}>
            <div style={{
                display: "flex",
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
            }}>
                <div className="flex-one"
                     style={{fontSize: 18, fontWeight: 'bold', color: Colors.accent}}>Notifications
                </div>
                <div className="">
                    <Button color="primary"
                            onClick={readAllNotifications}
                    >
                        Mark all read
                    </Button>
                </div>


            </div>
            {list?.map((item: any, index: number) => {
                return (
                    <div key={'notification-' + index} onClick={openNotification.bind(null, item)}>
                        <NotificationCardComponent notification={item}/>
                    </div>
                )
            })}
            {/* {pagination && <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={pagination.total}
                rowsPerPage={pagination.limit}
                page={pagination.page - 1}
                onChangePage={(event, page) => {
                    console.log(page, 'page');
                    getNotificationsList(page + 1, pagination?.limit || 10)
                }}
                onChangeRowsPerPage={event => getNotificationsList(0, +event.target.value)}
            />} */}
        </div>
    )
}

export default NotificationScreen
