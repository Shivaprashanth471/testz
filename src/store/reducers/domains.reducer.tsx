import {SET_DOMAINS} from "../actions/domains.action";

export interface DomainParams {
	domains: any[],
	domainIdMap: any,
	moduleIdMap: any
}

const initialData: DomainParams = {
	domains: [],
	domainIdMap: {},
	moduleIdMap: {}
};
const domainsReducer = (state = initialData, action: any): DomainParams => {
	switch (action.type) {
		case SET_DOMAINS:
			const domainsMap: any = {}
			const moduleMap: any = {}
			action.domains.forEach((item: any) => {
				domainsMap[item.domain_id] = item;
				item.subdomains.forEach((module: any) => {
					moduleMap[module._id] = item;
				})
			})
			state = {...state, domains: action.domains, domainIdMap: domainsMap, moduleIdMap: moduleMap};
			return state;
		default:
			return state;
	}
}

export default domainsReducer;
