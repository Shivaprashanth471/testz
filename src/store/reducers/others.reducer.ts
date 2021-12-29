import {GET_MY_ORGANIZATION, SET_COUNSELLORS_LIST} from "../actions/others.action";

export interface OtherParams {
    organization?: any,
    counsellorsList?: any[]
}

const initialData: OtherParams = {
    organization: null,
    counsellorsList: [],
};
const othersReducer = (state = initialData, action: any): OtherParams => {
    switch (action.type) {
        case GET_MY_ORGANIZATION:
            state = {...state, organization: action.organization};
            return state;
        case SET_COUNSELLORS_LIST:
            state = {...state, counsellorsList: action.counsellorsList};
            return state;
        default:
            return state;
    }
}

export default othersReducer;
