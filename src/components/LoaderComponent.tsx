import { LinearProgress } from '@material-ui/core';
import React from 'react';


interface LoaderComponentProps {
    position?: string;
    zIndex?: number;
}


function LoaderComponent(props: LoaderComponentProps) {
    const loaderStyles: any = {
        position: `${props?.position ? props.position : 'fixed'}`,
        width: '100%',
        height: '100%',
        zIndex: `${props?.zIndex ? props?.zIndex : 1}`,
    }

    return (
        <div className="loader" style={loaderStyles}>
            <LinearProgress color='primary' {...props} />
        </div>
    );
}

export default LoaderComponent;
