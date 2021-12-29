import {SET_NOTIFICATION_POLL_DATA} from "../actions/polling.action";

export interface PollingParams {
    notifications?: any[],
    currentNotificationsIds: string[],
    lastCheckedTime?: string,
    newNotificationsCount: number
}

const initialData: PollingParams = {
    notifications: undefined,
    currentNotificationsIds: [],
    lastCheckedTime: undefined,
    newNotificationsCount: 0,
};
const pollingReducer = (state = initialData, action: any): PollingParams => {
    switch (action.type) {
        case SET_NOTIFICATION_POLL_DATA:
            let {notifications, lastTime} = action;
            notifications = (notifications || []);
            // const newNotifications = notifications.filter((item:any) => !state.currentNotificationsIds.includes(item._id));
            const unreadNotifications = notifications.filter((item: any) => !item.is_read);
            const newNotificationsCount = unreadNotifications.length || 0;
            // console.log('newNotificationsCount', newNotificationsCount, 'unreadNotifications', unreadNotifications);
            const currentNotificationsIds = notifications.map((item: any) => item._id);
            state = {
                ...state,
                notifications,
                lastCheckedTime: lastTime,
                newNotificationsCount,
                currentNotificationsIds
            };
            return state;
        default:
            return state;
    }
}

export default pollingReducer;
