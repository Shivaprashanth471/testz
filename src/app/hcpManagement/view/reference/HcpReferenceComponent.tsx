import React, { PropsWithChildren } from 'react';
import NoDataToShowCardComponent from '../../../../components/NoDataToShowCardComponent';


export interface HcpReferenceComponentProps{
    referenceDetails:any;
}

const HcpReferenceComponent = (props:PropsWithChildren<HcpReferenceComponentProps>) => {
    const referenceDetails = props?.referenceDetails;
    return <div>
        {
          referenceDetails?.length>0 ? referenceDetails?.map((item: any, index: any) => {
                return (
                    <div className={index !== 0 ? "mrg-top-30" : ""}>
                        <h4 className="title-count">Reference {index + 1}</h4>
                        <div className="d-flex">
                            <div className="flex-1">
                                <h4>Reference Name</h4>
                                <p>{item.reference_name}</p>
                            </div>
                            <div className="flex-1">
                                <h4>Reference Job Title</h4>
                                <p>{item.job_title}</p>
                            </div>
                            <div className="flex-1">
                                <h4>Reference Contact Number</h4>
                                <p>{item.phone}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="flex-1">
                                <h4>Reference Email</h4>
                                <p>{item.email}</p>
                            </div>
                        </div>
                    </div>
                )
            }):<NoDataToShowCardComponent/>
        }
    </div>;
}

export default HcpReferenceComponent;