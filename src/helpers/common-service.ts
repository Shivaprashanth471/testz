import Communications from './communications-service';
import queryString from "querystring";
import { FormikErrors } from "formik";
import { toast, ToastOptions, TypeOptions } from "react-toastify";
import { TsConfirmationConfig } from "../constants/CommonTypes";
import axios, { CancelTokenSource } from "axios";
import ApiService from './api-service';
import moment, { Moment } from "moment";

export const ADMIN = 'super_admin';
export const HUMANRESOURCE = 'hr';
export const ACCOUNTMANAGER = 'account_manager';
export const NURSECHAMPION = 'nurse_champion';
export const FINANCEMANAGER = 'finance_manager';


const parseQueryString = (q: string): any => {
    return queryString.parse(q.replace('?', ''));
}
const getBytesInMB = (bytes: number) => {
    return bytes / (1024 * 1024);
}
const formatSizeUnits = (bytes: number, decimals = 2) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const getRandomID = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
const showToast = (msg: string, type: TypeOptions = "info", options: ToastOptions = {}) => {
    switch (type) {
        case 'info':
            toast.info(msg, options);
            break;
        case 'success':
            toast.success(msg, options);
            break;
        case 'error':
            toast.error(msg, options);
            break;
        case 'warning':
            toast.warning(msg, options);
            break;
        default:
            toast.dark(msg, options);
            break;
    }
};
const handleErrors = (setErrors: (errors: FormikErrors<any>) => void, err: any) => {
    if (err.errors) {
        const errors: any = {};
        for (let field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = err.errors[field][0];
            }
        }
        setErrors(errors);
    } else if (err.error) {
        showToast(err.error, "error");
    }
};
const onConfirm = (config: TsConfirmationConfig = {}) => {
    const defaultConfig: TsConfirmationConfig = {
        confirmationText: 'Are you sure ?',
        yes: { text: 'Yes, Confirm', color: 'default' },
        no: { text: 'No, Cancel', color: 'primary' }
    }
    config = { ...defaultConfig, ...config };
    return new Promise((resolve, reject) => {
        Communications.ConfirmStateSubject.next({ config, promise: { resolve, reject } })
    });
}
const openDialog = (component: any) => {
    return new Promise((resolve, reject) => {
        Communications.DialogStateSubject.next({ component, promise: { resolve, reject } })
    });
}
const getCancelToken = (): CancelTokenSource => {
    return axios.CancelToken.source();
}

const getPayloadFilterDates = (mode: 'day' | 'week' | 'month'): { start_date: string, end_date: string } => {
    const payload = { start_date: '', end_date: moment().format('YYYY-MM-DD') }
    switch (mode) {
        case "day":
            payload.start_date = moment().format('YYYY-MM-DD')
            break;
        case "week":
            payload.start_date = moment().subtract(1, 'week').format('YYYY-MM-DD')
            break;
        case "month":
            payload.start_date = moment().subtract(1, "month").format('YYYY-MM-DD')
            break;
    }
    return payload;
}

const getExtraPayloadFilterDates = (mode: 'day' | 'week' | 'month'): { start_date: string, end_date: string } => {
    const payload = { start_date: '', end_date: '' };
    switch (mode) {
        case "day":
            payload.start_date = moment().subtract(1, 'day').format('YYYY-MM-DD')
            payload.end_date = moment().subtract(1, 'day').format('YYYY-MM-DD')
            break;
        case "week":
            payload.start_date = moment().subtract(2, 'week').format('YYYY-MM-DD')
            payload.end_date = moment().subtract(1, 'week').format('YYYY-MM-DD')
            break;
        case "month":
            payload.start_date = moment().subtract(2, "month").format('YYYY-MM-DD')
            payload.end_date = moment().subtract(1, "month").format('YYYY-MM-DD')
            break;
    }
    return payload;
}

const duration = (start: Moment, end: Moment) => {
    return moment.duration(end.diff(start)).humanize();
}

const durationFromHHMM = (start: string, end: string) => {
    let duration = moment(end, 'hh:mm').diff(moment(start, 'hh:mm'), "minutes");

    if (duration > 0) {
        return convertMinsToHrsMins(duration);
    } else {
        return '-'
    }
}

const getFormDataFromJSON = (json: any): FormData => {
    const payload = new FormData();
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            payload.append(key, json[key]);
        }
    }
    return payload;
};

const durationBetweenTimeStamps = (start: any, end: any) => {
    let duration = moment(end).diff(moment(start), "minutes");

    // console.log(duration, 'duration');
    // console.log(duration, 'duration');
    // console.log(start, 'start');
    // console.log(end, 'end');

    return convertMinsToHrsMins(duration);

}

const convertMinsToHrsMins = (minutes: number) => {
    let h: string | number = Math.floor(minutes / 60);
    let m: string | number = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
}

const convertHoursToMinutes = (timeInHour: string | any) => {
    const timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

const convertRelativeTimeToLocalTime = (timezone: number, startTimeInMins: number, endTimeInMins: number) => {
    let facilityTimezoneOffset = timezone
    let startTime = CommonService.convertMinsToHrsMins(startTimeInMins)
    let endTime = CommonService.convertMinsToHrsMins(endTimeInMins)

    let startTimeAndDate = moment(moment().format('YYYY-MM-DD') + ' ' + startTime);
    let endTimeAndDate = moment(moment().format('YYYY-MM-DD') + ' ' + endTime);

    let start, end
    if (facilityTimezoneOffset > 1) {
        start = moment(startTimeAndDate).subtract(facilityTimezoneOffset, 'minutes').format('LT')
        end = moment(endTimeAndDate).subtract(facilityTimezoneOffset, 'minutes').format('LT')
    } else if (facilityTimezoneOffset < 1) {
        start = moment(startTimeAndDate).add(facilityTimezoneOffset, 'minutes').format('LT')
        end = moment(endTimeAndDate).add(facilityTimezoneOffset, 'minutes').format('LT')
    }

    return { start, end }
}

const getUtcTimeInAMPM = (raw_utc_start_time: any, raw_utc_end_time: any) => {
    function z(n: any) {
        return ('0' + n).slice(-2);
    }

    let raw_start_utc = new Date(raw_utc_start_time);
    let raw_end_utc = new Date(raw_utc_end_time);

    let utcStartTime = z(raw_start_utc.getUTCHours()) + ':' + z(raw_start_utc.getUTCMinutes());
    let utcEndTime = z(raw_end_utc.getUTCHours()) + ':' + z(raw_end_utc.getUTCMinutes())

    let start_time = moment((utcStartTime), 'hh:mm').format('LT')
    let end_time = moment((utcEndTime), 'hh:mm').format('LT')

    return { start_time, end_time }
}

const getUtcTimeinHours = (raw_utc_start_time: any, raw_utc_end_time: any) => {
    function z(n: any) {
        return ('0' + n).slice(-2);
    }

    let raw_start_utc = new Date(raw_utc_start_time);
    let raw_end_utc = new Date(raw_utc_end_time);

    let start_time = z(raw_start_utc.getUTCHours()) + ':' + z(raw_start_utc.getUTCMinutes());
    let end_time = z(raw_end_utc.getUTCHours()) + ':' + z(raw_end_utc.getUTCMinutes())

    return { start_time, end_time }
}


const getUtcDate = (raw_utc_date: any) => {

    if (raw_utc_date) {
        let raw_date_utc = new Date(raw_utc_date);
        let utcDate = raw_date_utc.toISOString().split("T")[0]
        let shift_date = moment(utcDate).format('MM-DD-YYYY')
        return shift_date
    }
    else {
        return ''
    }

}

const getYearsDiff = (start_date: any, end_date: any) => {
    console.log(start_date, end_date)
    if (end_date) {
        return Math.round(moment(end_date).diff(start_date, 'years', true) * 10) / 10;
    } else {
        let end_date = moment().format('YYYY-MM')
        console.log('enddata', end_date)
        return Math.round(moment(end_date).diff(start_date, 'years', true) * 10) / 10;
    }
}


const sortDatesByLatest = (arr: any[], fieldName: string) => {
    const newarr = arr.sort((a, b) => {
        return moment(b[fieldName]).diff(a[fieldName]);
    });

    return newarr
}


const CommonService = {
    parseQueryString,
    handleErrors,
    onConfirm,
    openDialog,
    showToast,
    formatSizeUnits,
    getRandomID,
    getBytesInMB,
    getCancelToken,
    getPayloadFilterDates,
    getExtraPayloadFilterDates,
    duration,
    durationFromHHMM,
    convertMinsToHrsMins,
    convertHoursToMinutes,
    getUtcTimeInAMPM,
    getUtcTimeinHours,
    getUtcDate,
    getYearsDiff,
    sortDatesByLatest,
    convertRelativeTimeToLocalTime,
    durationBetweenTimeStamps,
    getFormDataFromJSON,
    _api: ApiService,
    _communications: Communications,
}
export default CommonService;
