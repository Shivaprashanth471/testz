export const NOTIFICATION_POLL_START = 'NOTIFICATION_POLL_START';
export const NOTIFICATION_POLL_STOP = 'NOTIFICATION_POLL_STOP';
export const SET_NOTIFICATION_POLL_DATA = 'SET_NOTIFICATION_POLL_DATA';
export const MARK_ALL_NOTIFICATION_READ = 'MARK_ALL_NOTIFICATION_READ';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';


export const startNotificationPolling = () => {
    return {type: NOTIFICATION_POLL_START};
};
export const markAllNotificationRead = (date: string) => {
    return {type: MARK_ALL_NOTIFICATION_READ, date};
};


export const markNotificationRead = (notification_id: string) => {
    return {type: MARK_NOTIFICATION_READ, notification_id};
};

export const stopNotificationPolling = () => {
    return {type: NOTIFICATION_POLL_STOP};
};

export const setNotificationPollingData = (notifications: any[], lastTime?: string) => {
    return {type: SET_NOTIFICATION_POLL_DATA, notifications, lastTime};
};

