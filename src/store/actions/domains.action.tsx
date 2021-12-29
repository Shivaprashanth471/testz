export const GET_DOMAINS = 'GET_DOMAINS';
export const SET_DOMAINS = 'SET_DOMAINS';

export const getDomains = () => {
	return {type: GET_DOMAINS};
};
export const setDomains = (domains: any[]) => {
	return {type: SET_DOMAINS, domains};
};
