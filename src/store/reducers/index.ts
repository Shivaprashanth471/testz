import {combineReducers} from "redux";
import authReducer, {AuthParams} from "./auth.reducer";
import othersReducer, {OtherParams} from "./others.reducer";
import domainsReducer, {DomainParams} from "./domains.reducer";
import pollingReducer, {PollingParams} from "./polling.reducer";

export interface StateParams {
    auth: AuthParams,
    other: OtherParams,
    domains: DomainParams,
    polling: PollingParams,
}

const rootReducer = combineReducers({
    auth: authReducer,
    other: othersReducer,
    domains: domainsReducer,
    polling: pollingReducer,
});

export default rootReducer;
