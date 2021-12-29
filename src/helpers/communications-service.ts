import {BehaviorSubject, Subject} from "rxjs";
import {TsConfirmationConfig} from "../constants/CommonTypes";

const logoutSubject: Subject<void> = new Subject();
const updateLoginUserTokenSubject: Subject<string> = new Subject<string>();
const updateActiveUserIdSubject: Subject<string> = new Subject<string>();
const NetworkChangeSubject: Subject<boolean> = new Subject<boolean>();
const ReloadStateSubject: Subject<boolean> = new Subject<boolean>();
const PageLoadingStateSubject: Subject<boolean> = new Subject<boolean>();

const ConfirmStateSubject: Subject<{ config: TsConfirmationConfig, promise: { resolve: any, reject: any } }> = new Subject<{ config: TsConfirmationConfig; promise: { resolve: any; reject: any } }>()
const DialogStateSubject: Subject<{ component: any, promise: { resolve: any, reject: any } }> = new Subject<{ component: any; promise: { resolve: any; reject: any } }>()

const SetUserColorScheme: Subject<'light' | 'dark'> = new Subject<'light' | 'dark'>();

const pageBackButtonSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
const pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

const Communications = {
    logoutSubject,
    updateActiveUserIdSubject,
    updateLoginUserTokenSubject,
    NetworkChangeSubject,
    ReloadStateSubject,
    SetUserColorScheme,
    PageLoadingStateSubject,
    pageBackButtonSubject,
    pageTitleSubject,

    ConfirmStateSubject,
    DialogStateSubject
};

export default Communications;
