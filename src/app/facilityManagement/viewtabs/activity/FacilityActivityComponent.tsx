import React from 'react';
import FacilityActivityCardComponent from './card/FacilityActivityCardComponent';
import './FacilityActivityComponent.scss'

const FacilityActivityComponent = () => {
    return <div className='activity'>
        <p className='title '>Today</p>
        <div className="custom-card">
            {
                [1, 2, 3].map((item: any, index: number) => <FacilityActivityCardComponent />)
            }

        </div>

    </div>;
}

export default FacilityActivityComponent;