/**
 * Saga worker.
 */
import {call, delay, put, race, take, takeEvery} from "redux-saga/effects";
import {
    MARK_ALL_NOTIFICATION_READ,
    MARK_NOTIFICATION_READ,
    NOTIFICATION_POLL_START,
    NOTIFICATION_POLL_STOP,
    setNotificationPollingData, startNotificationPolling, stopNotificationPolling
} from "../actions/polling.action";
import {ApiService} from "../../helpers";
import {ENV} from "../../constants";
import moment from "moment";

const fetchNotification = () => {
    const start_date = moment().subtract(1, 'year').format('YYYY-MM-DD');
    const end_date = moment().format('YYYY-MM-DD');
    return ApiService.post(ENV.API_URL + 'notification/list', {start_date, end_date});
}

function* notificationPollWorker() {
    while (true) {
        try {
            const {data} = yield call(fetchNotification);
            console.log(data);
            const notifications = data.docs || [];
            const lastTime = data.docs?.current_time;
            yield put(setNotificationPollingData(notifications, lastTime));
            yield delay(5000);
        } catch (err) {
            console.log(err);
            yield put(setNotificationPollingData([]));
        }
    }
}

const updateNotificationRead = (notification_id: string) => {
    return ApiService.post(ENV.API_URL + 'notification/edit', {notification_id});
}

function* setNotificationRead({notification_id}: any) {
    try {
        yield call(updateNotificationRead, notification_id);
        yield put(stopNotificationPolling());
        yield put(startNotificationPolling());
        // console.log(data, 'setNotificationRead');
    } catch (err) {
        console.log(err);
    }
}


const updateAllNotificationRead = (date: string) => {
    return ApiService.post(ENV.API_URL + 'notification/markAsRead', {date});
}

function* setAllNotificationRead({date}: any) {
    try {
        yield call(updateAllNotificationRead, date);
        yield put(stopNotificationPolling());
        yield put(startNotificationPolling());
    } catch (err) {
        console.log(err);
    }
}

/**
 * Saga watcher.
 */
export default function* pollSaga() {
    yield takeEvery(MARK_NOTIFICATION_READ, setNotificationRead);
    yield takeEvery(MARK_ALL_NOTIFICATION_READ, setAllNotificationRead);
    while (true) {
        yield take(NOTIFICATION_POLL_START);
        yield race([
            call(notificationPollWorker),
            take(NOTIFICATION_POLL_STOP)
        ]);
    }
}

