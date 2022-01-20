import { LinearProgress } from '@material-ui/core';
import React from 'react';


const loaderStyles: any = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 9999,
}

function LoaderComponent(props: any) {
    return (
        <div className="loader" style={loaderStyles}>
            <LinearProgress color='primary' {...props} />
        </div>
    );
}

export default LoaderComponent;
