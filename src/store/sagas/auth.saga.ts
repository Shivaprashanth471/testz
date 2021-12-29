import {call, put, takeEvery} from 'redux-saga/effects'
import {LOGIN_CHECK, LOGIN_USER, LOGOUT_USER, updateLoginUser} from "../actions/auth.action";
import {ApiService, Communications} from "../../helpers";
import {ENV} from "../../constants";

// LOGIN_USER
function* loginUser(action: any) {
    // console.log('login user ', action);
}

// LOGOUT_USER
function* logoutUser(action: any) {
    // console.log('logout user ',action);
}

// LOGOUT_USER
const fetchCheckLogin = () => {
    return ApiService.get(ENV.API_URL + 'user/checkLogin');
};

function* loginCheck() {
try {
// @ts-ignore
const resp = yield call(fetchCheckLogin);
yield put(updateLoginUser(resp.data));
} catch (error) {
Communications.logoutSubject.next();
}
}


// use them in parallel
export default function* authSaga() {
    yield takeEvery(LOGIN_USER, loginUser);
    yield takeEvery(LOGIN_CHECK, loginCheck);
    yield takeEvery(LOGOUT_USER, logoutUser);
}
