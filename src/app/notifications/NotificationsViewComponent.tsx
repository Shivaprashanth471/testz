import {Button, DialogActions} from '@material-ui/core';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {Colors} from '../../constants';
import {DialogMethodProps} from '../../constants/CommonTypes';
import ErrorComponent from "../../components/core/ErrorComponent";
import {NotificationsNoneOutlined} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {StateParams} from "../../store/reducers";
import NotificationCardComponent from "./cards/NotificationCardComponent";
import {markAllNotificationRead, markNotificationRead} from "../../store/actions/polling.action";


const NotificationsViewComponent = (props: DialogMethodProps) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const closeModal = props?.cancel;
    const {notifications, lastCheckedTime} = useSelector((state: StateParams) => state.polling)
    const gotoNotifications = useCallback(() => {
        if (closeModal) {
            closeModal();
        }
        history.push("/notifications");
    }, [closeModal, history]);

    const readAllNotifications = useCallback(() => {
        dispatch(markAllNotificationRead(lastCheckedTime || new Date().toString()));
    }, [lastCheckedTime, dispatch]);


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
        if (closeModal) {
            closeModal();
        }
        dispatch(markNotificationRead(item._id));
        history.push('/student/view/' + student_master_id, {domain_id, session_id, script_id, module_id: subdomain_id});
    }, [history, dispatch, closeModal])

    return (
        <>
            <div className={'dialog-content-wrapper'}>
                <div className="dialog-title-text mrg-top-0">
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="flex-one"></div>
                        <div className="flex-one">Notifications</div>
                        <div className="flex-one">
                            <Button color="primary"
                                    className="mrg-bottom-10"
                                    onClick={readAllNotifications}
                            >
                                Mark all read
                            </Button>
                        </div>


                    </div>


                </div>

                {
                    notifications && notifications.length > 0 && <>
                        {notifications?.map((item: any, index: number) => {
                            return (
                                <div key={'notification-' + index} onClick={openNotification.bind(null, item)}>
                                    <NotificationCardComponent notification={item}/>
                                </div>
                            )
                        })}
                        <DialogActions className={"mrg-top-20"}>
                            <Button style={{width: '100%'}} color={"primary"} variant={"contained"}
                                    className={'mrg-bottom-20'} onClick={gotoNotifications}>
                                View All
                            </Button>
                        </DialogActions>
                    </>
                }
                {(!notifications || (notifications && notifications.length === 0)) &&
                <ErrorComponent textContainerStyle={{marginBottom: '2px'}} text={'No Notifications'}
                                textColor={Colors.primary} textSize={26} descriptionTextSize={16}
                                descriptionText={'Please check back in later'}
                                descriptionTextStyle={{fontWeight: 'bold'}} icon={<NotificationsNoneOutlined
                    style={{width: 150, marginTop: 20, height: 150, color: '#c4ced6'}}/>}/>
                }
            </div>
        </>
    )
};

export default NotificationsViewComponent
