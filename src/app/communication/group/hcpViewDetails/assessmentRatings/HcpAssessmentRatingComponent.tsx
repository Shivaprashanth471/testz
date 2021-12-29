import React from 'react';
import "./HcpAssessmentRatingComponent.scss";

const HcpAssessmentRatingComponent = () => {
    return <div className="hcp_assessment_rating screen">
        <div className="d-flex">
            <div className="flex-1">
                <h4>Assessment Taken On</h4>
                <p>05-06-2021</p>
            </div>
            <div className="flex-1">
                <h4>Assessment Completed On</h4>
                <p>05-06-2021</p>
            </div>
            <div className="flex-1">
                <h4>No. Of Attempts</h4>
                <p>10</p>
            </div>
            <div className="flex-1">
                <h4>Assessment Score</h4>
                <p>80%</p>
            </div>
        </div>
    </div>;
}


export default HcpAssessmentRatingComponent;