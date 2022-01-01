import React, { useCallback, useEffect, useState } from 'react';
import './HcpContractComponent.scss';
import CustomFile from '../../../../components/shared/CustomFile';
import { CommonService } from '../../../../helpers';
import { ENV } from '../../../../constants';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const HcpContractComponent = () => {
    const params = useParams<{ id: string }>();
    const { id } = params
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
            {
                contractDetails !== undefined ?
                    <div className="custom-border pdd-20 pdd-left-40 pdd-right-40">
                        <div>
                            <CustomFile data={contractDetails} />
                        </div>
                        <div className="d-flex">
                            <div className="flex-1">
                                <h4>Rate/hr</h4>
                                <p>{contractDetails?.rate_per_hour}&nbsp;$</p>
                            </div>
                            <div className="flex-1">
                                <h4>Signed On</h4>
                                <p>{moment(contractDetails?.signed_on).format("MMMM Do YYYY")}</p>
                            </div>
                            <div className="flex-1">
                                <h4>Salary Credit</h4>
                                <p>{contractDetails?.salary_credit_date}</p>
                            </div>
                            <div className="flex-1">

                            </div>
                        </div>
                    </div> : <></>
            }
        </div>
    </> : <></>
}

export default HcpContractComponent;