import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getDomains} from "../store/actions/domains.action";
import {StateParams} from "../store/reducers";
import {Button, Checkbox, DialogActions, DialogContent, FormLabel} from "@material-ui/core";
import AccordionComponent from "./core/AccordionComponent";
import {Colors} from "../constants";

interface ModulesFilterComponentProps {
    cancel: () => void,
    confirm: (filter: any) => void
}

const ModulesFilterComponent = (props: ModulesFilterComponentProps) => {
    const {confirm, cancel} = props;
    const dispatch = useDispatch();
    const {domainIdMap, domains} = useSelector((state: StateParams) => state.domains)
    useEffect(() => {
        // console.log('in filter module')
        dispatch(getDomains())
    }, [dispatch])

    // const [filter, setFilter]: any = useState({domains: [], modules: []});
    const [domainFilter, setDomainFilter]: any[] = useState([]);
    const [moduleFilter, setModuleFilter]: any[] = useState([]);
    const [allChecked, setAllChecked] = useState<boolean>(false);
    // useEffect(() => {
    // 	console.log('updating filters', domainFilter, moduleFilter);
    // 	setFilter({domains: domainFilter, modules: moduleFilter})
    // }, [domainFilter, moduleFilter])

    useEffect(() => {
        const newDomains: any[] = [];
        const newModules: any[] = [];
        if (allChecked) {
            domains.forEach((item: any) => {
                newDomains.push(item.domain_id);
                item.subdomains.forEach((module: any) => {
                    newModules.push(module._id);
                });
            });
        }
        setDomainFilter(newDomains);
        setModuleFilter(newModules);
    }, [allChecked, domains])

    const updateDomainModules = (domainId: string, select: boolean) => {
        setModuleFilter((moduleIds: string[]) => {
            domainIdMap[domainId].subdomains.forEach((module: any) => {
                const moduleId = module._id;
                const index = moduleFilter.indexOf(moduleId);
                if (index > -1) {
                    if (!select) {
                        moduleIds.splice(index, 1);
                    }
                } else {
                    if (select) {
                        moduleIds.push(moduleId)
                    }
                }
            });
            return [...moduleIds];
        })
    }

    const toggleCheckDomain = (domainId: string) => {
        // console.log('filter', domainId);
        setDomainFilter((f: any) => {
            const index = f.indexOf(domainId);
            if (index > -1) {
                f.splice(index, 1);
                updateDomainModules(domainId, false);
            } else {
                f.push(domainId);
                updateDomainModules(domainId, true);
            }
            return [...f];
        })
    }
    const toggleCheckModule = (moduleId: string) => {
        // console.log('filter module', moduleId);
        setModuleFilter((f: any) => {
            const index = f.indexOf(moduleId);
            if (index > -1) {
                f.splice(index, 1)
            } else {
                f.push(moduleId)
            }
            return [...f];
        })
    }

    const applyFilter = () => {
        // console.log('filters', domainFilter, moduleFilter);
        if (confirm) confirm({domains: domainFilter, modules: moduleFilter});
    }
    return (
        <>
            <DialogContent>
                <div className={'mainContent component modules-filter mrg-top-20'}>
                    <div className={'domainLevelWrapper'}>
                        <FormLabel style={{cursor: "pointer",}}>
                            <Checkbox size={"small"} className={'domainLevelBtn'} checked={allChecked}
                                      onChange={(event, checked) => setAllChecked(checked)}/>
                            All
                        </FormLabel>
                    </div>
                    {domains && domains.length > 0 && domains.map((item: any, index: number) => {
                        return (<AccordionComponent key={'domain-' + item.domain_id} header={
                            <div className={'domainLevelWrapper'} style={{
                                padding: '0 10px',
                                borderColor: '#AAA',
                                flex: 1,
                                display: 'flex',
                                borderBottomWidth: 1,
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <Checkbox size={"small"} onChange={toggleCheckDomain.bind(null, item.domain_id)}
                                          checked={domainFilter.indexOf(item.domain_id) !== -1}
                                />
                                <div className={'domainLevelBtn'}
                                     style={{flex: 1}}
                                    // onClick={toggleCheckDomain.bind(null, item.domain_id)}
                                >
                                    <div style={{
                                        fontSize: 18,
                                        textTransform: "capitalize",
                                        color: Colors.accent,
                                        paddingLeft: 10
                                    }} className={'domainLevelText'}>{item.title}</div>
                                </div>
                            </div>
                        }>
                            <div style={{margin: '10px 0'}}>
                                {item.subdomains && item.subdomains.length > 0 && item.subdomains.map((module: any, moduleIndex: number) => {
                                    return <div key={module._id} className={'moduleLevelWrapper'} style={{
                                        padding: '0 10px',
                                        paddingLeft: 40,
                                        flex: 1,
                                        flexDirection: "row",
                                        display: "flex",
                                    }}>
                                        <Checkbox size={"small"} checked={moduleFilter.indexOf(module._id) !== -1}
                                                  onChange={toggleCheckModule.bind(null, module._id)}/>
                                        <div className={'moduleLevelBtn'}
                                             style={{width: '80%', display: "flex", alignItems: 'center', flex: 1}}
                                            // onClick={toggleCheckModule.bind(null, module._id)}
                                        >
                                            <div className={'moduleLevelText'} style={{
                                                fontSize: 16,
                                                textTransform: "capitalize",
                                                color: Colors.accent,
                                                opacity: 0.9,
                                                paddingLeft: 10
                                            }}>{module.title}</div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </AccordionComponent>)
                    })}
                </div>
            </DialogContent>
            <DialogActions>
                <div className={'btn-group modules-filter-component'}>
                    <Button onClick={cancel} color={"primary"} variant={"outlined"}>Cancel</Button>
                    <Button variant={"contained"} color={"primary"} onClick={applyFilter}>Confirm</Button>
                </div>
            </DialogActions>
        </>
    )
};

export default ModulesFilterComponent;
