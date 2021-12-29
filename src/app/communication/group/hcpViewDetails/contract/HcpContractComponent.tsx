import React, { useCallback, useEffect, useState } from 'react';
import './HcpContractComponent.scss';
import CustomFile from '../../../../../components/shared/CustomFile';
import moment from 'moment';
import { CommonService } from '../../../../../helpers';
import { ENV } from '../../../../../constants';

const HcpContractComponent = (props: any) => {
    const id = props?.id;
    const [contractDetails, setContractDetails] = useState<any | null>(null)
    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'hcp/' + id + '/contract').then((resp) => {
            setContractDetails(resp?.data[0]);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    useEffect(() => {
        init()
    }, [init])
    return <>
        <div className="hcp_contract_details mrg-top-40">
            {
                contractDetails ?
                    <div className="custom-border pdd-20 pdd-left-40 pdd-right-40">
                        <div>
                            <CustomFile data={contractDetails} />
                        </div>
                        <div className="d-flex">
                            <div className="flex-1">
                                <h4>Rate/hr</h4>
                                <p>{contractDetails?.rate_per_hour}$</p>
                            </div>
                            <div className="flex-1">
                                <h4>Signed On</h4>
                                <p>{moment(contractDetails?.signed_on).format('MMMM, YYYY')}</p>
                            </div>
                            <div className="flex-1">
                                <h4>Salary Credit</h4>
                                <p>{moment(contractDetails?.salary_credit_date).format('MMMM, YYYY')}</p>
                            </div>
                            <div className="flex-1">

                            </div>
                        </div>
                    </div> : <></>
            }
        </div>
    </>
}


export default HcpContractComponent;