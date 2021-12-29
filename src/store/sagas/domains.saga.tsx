import {call, put, takeEvery} from 'redux-saga/effects'
import {ApiService} from "../../helpers";
import {ENV} from "../../constants";
import {GET_DOMAINS, setDomains} from "../actions/domains.action";

const fetchDomains = () => {
	return ApiService.post(ENV.API_URL + 'domain/allModules', {});
};

function* getDomainList(action: any) {
	try {
// @ts-ignore
		const resp = yield call(fetchDomains);
		yield put(setDomains(resp.data));
	} catch (error) {
		yield put(setDomains([]));
	}
}

// use them in parallel
export default function* domainsSaga() {
	yield takeEvery(GET_DOMAINS, getDomainList);
}
