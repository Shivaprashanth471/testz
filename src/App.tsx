import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApiService, Communications, localStore } from "./helpers";
import { loginUser, logoutUser } from "./store/actions/auth.action";
import { ToastContainer } from "react-toastify";
import ConfirmComponent from "./components/ConfirmComponent";
import MainRouter from "./navigation/navigator";

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
// @ts-ignore
import packageData from '../package.json';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { ENV } from "./constants";

const APP_VERSION = packageData.version;
// console.log(process.env);
const App = () => {
    const dispatch = useDispatch();

    const [isPageLoading, setIsPageLoading] = useState(true);
    const checkLogin = useCallback((token) => {
        return ApiService.get(ENV.API_URL + 'user/checkLogin', {}, { 'Authorization': 'Bearer ' + token });
    }, [])
    useEffect(() => {
        let user = null;
        const userString = localStore.getItem('currentUser');
        if (userString) {
            try {
                user = JSON.parse(userString);
            } catch (e) {
                user = null;
            }
        }
        const token = localStore.getItem('token');
        if (token) {
            checkLogin(token).then((resp) => {
                // console.log(resp);
                user = resp.data.user;
                dispatch(loginUser(user, token));

                setIsPageLoading(false)
            }).catch((err) => {
                console.log(err);
                setIsPageLoading(false)
                dispatch(logoutUser());
            })
        } else {
            setIsPageLoading(false)
            // dispatch(logoutUser());
        }
    }, [dispatch, checkLogin])

    useEffect(() => {
        const pageLoadingSub = Communications.PageLoadingStateSubject.subscribe(isPageLoading => {
            setIsPageLoading(isPageLoading);
        })
        return () => {
            pageLoadingSub.unsubscribe();
        }
    }, []);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="App">
                <ConfirmComponent />
                {/*<DialogComponent />*/}
                <ToastContainer position={"top-center"} newestOnTop={true} />
                {isPageLoading && <div className="page-loading" />}
                <MainRouter />
                <div className={'app_version_wrapper'}>v{APP_VERSION}</div>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default App;
