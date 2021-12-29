import { Divider } from '@material-ui/core';
import React from 'react';
import './FacilityActivityCardComponent.scss'


const FacilityActivityCardComponent = () => {
    return <div className='card'>
        <div className="card-title">
            <p className='card-header'>
                Shift Request 1
            </p>
            <span className='card-date'>16th July,2021 | 8:30pm</span>
        </div>

        <div className="card-content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed eum doloremque molestias adipisci ab possimus! Nobis reiciendis exercitationem fugiat quaerat soluta consectetur eligendi perspiciatis, mollitia et. Eum sit nesciunt excepturi.
        </div>
        <Divider style={{ color: 'lightgray', marginTop: '1rem', }} />
    </div>;
}

export default FacilityActivityCardComponent;