import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import './HcpContractComponent.scss';
import CustomFile from '../../../../components/shared/CustomFile';
import { CommonService } from '../../../../helpers';
import { ENV } from '../../../../constants';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import NoDataToShowCardComponent from "../../../../components/NoDataToShowCardComponent";

export interface HcpContactComponentProps {
    hcpDetails: any;
}

const HcpContractComponent = (props: PropsWithChildren<HcpContactComponentProps>) => {

    const hcpDetails = props?.hcpDetails;

    const params = useParams<{ id: string }>();
    const { id } = params;
    const [contractDetails, setContractDetails] = useState<any | null>(null)
    const [isContractLoading, setIsContractLoading] = useState<boolean>(true)
    const init = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'hcp/' + id + '/contract').then((resp) => {
            setContractDetails(resp?.data[0]);
            setIsContractLoading(false)
        }).catch((err) => {
            console.log(err)
            setIsContractLoading(false)
        })
    }, [id])

    useEffect(() => {
        init()
    }, [init])

    return !isContractLoading ? <>
        <div className="hcp_contract_details mrg-top-10">
            <div className="custom-border pdd-20 pdd-left-40 pdd-right-40">
                {
                    contractDetails !== undefined ?
                        <div>
                            <CustomFile data={contractDetails} />
                        </div> : <h3 className="contract-heading">Contract</h3>
                }
                {
                    hcpDetails?.contract_details ?
                        <div className="d-flex">
                            <div className="flex-1">
                                <h4>Rate/hr</h4>
                                <p>{hcpDetails?.contract_details?.rate_per_hour}&nbsp;$</p>
                            </div>
                            <div className="flex-1">
                                <h4>Signed On</h4>
                                <p>{hcpDetails?.contract_details?.signed_on?moment(hcpDetails?.contract_details?.signed_on).format("MMMM Do YYYY"):"N/A"}</p>
                            </div>
                            <div className="flex-1">
                                <h4>Salary Credit Date</h4>
                                <p>{hcpDetails?.contract_details?.salary_credit}</p>
                            </div>
                            <div className="flex-1">

                            </div>
                        </div>
                        : <>
                            <NoDataToShowCardComponent />
                        </>

                }
            </div>
        </div>
    </> : <></>
}

export default HcpContractComponent;
