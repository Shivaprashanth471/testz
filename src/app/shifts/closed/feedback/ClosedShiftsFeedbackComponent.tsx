import React, { useState, useEffect, useCallback } from 'react';
import { CommonService, Communications } from '../../../../helpers';
import { useParams } from 'react-router-dom';
import { ENV } from '../../../../constants';

const ClosedShiftsFeedbackComponent = () => {
    const [rating, setRating] = useState<any>(-1);
    const param = useParams<any>()
    const { id } = param;
    const [basicDetails, setBasicDetails] = useState<any>(null);

    const getShiftDetails = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'shift/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setRating(3)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    console.log(basicDetails)

    useEffect(() => {
        getShiftDetails()
    }, [getShiftDetails])
    useEffect(() => {
        Communications.pageTitleSubject.next('Shifts Completed');
        Communications.pageBackButtonSubject.next('/completedShifts/list');
    }, [])
    return <div className="completed-shifts-feedback">
        <div className="">
            <div>
                <div className="d-flex">
                    <div className="flex-1">
                        <h3>Feedback:</h3>
                        <p>feedback</p>
                    </div>
                    <div className="flex-1">
                        <h3>Rating:</h3>
                        <div className="d-flex">
                            {
                                [1, 2, 3, 4, 5]?.map((item: any, index: any) => {
                                    if (index <= rating) {
                                        return (
                                            <div className="rating color-rating mrg-right-20"></div>
                                        )
                                    } else {
                                        return (
                                            <div className="rating mrg-right-20"></div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3>Attachments:</h3>
                        <p>feedback</p>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}



export default ClosedShiftsFeedbackComponent;