export const GET_MY_ORGANIZATION = 'GET_MY_ORGANIZATION';
export const SET_MY_ORGANIZATION = 'SET_MY_ORGANIZATION';

export const GET_COUNSELLORS_LIST = 'GET_COUNSELLORS_LIST';
export const SET_COUNSELLORS_LIST = 'SET_COUNSELLORS_LIST';

export const getMyOrganization = () => {
    return {type: GET_MY_ORGANIZATION};
};

export const setMyOrganization = (organization: any) => {
    return {type: SET_MY_ORGANIZATION, organization};
};

export const getCounsellorsList = (organizationId:string) => {
    return {type: GET_COUNSELLORS_LIST, organizationId};
};

export const setCounsellorsList = (counsellorsList: any[]) => {
    return {type: SET_COUNSELLORS_LIST, counsellorsList};
};
