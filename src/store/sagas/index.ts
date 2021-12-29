// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas
import authSaga from './auth.saga';
import otherSaga from './others.saga';
import domainSaga from './domains.saga';
import pollSaga from './polling.saga';

// Redux Saga: Root Saga
export function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(otherSaga),
        fork(domainSaga),
        fork(pollSaga),
    ]);
}
