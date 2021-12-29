import React, { useEffect } from 'react';
import { Communications } from '../../helpers';
import './DashboardScreen.scss';
import Lottie from "react-lottie";
import animationData from "../../animations/coming_soon.json";

const DashboardScreen = () => {
    const defaultOptions = {
        animationData
    };

    useEffect(() => {
        Communications.pageTitleSubject.next('Dashboard');
        Communications.pageBackButtonSubject.next(null);
    }, [])
 
    return <div>
        <Lottie
            width={1250}
            height={650}
            speed={1}
            options={defaultOptions}
        />
    </div>;
}

export default DashboardScreen;