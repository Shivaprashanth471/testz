import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function CircularProgressWithLabel(props: any) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress style={{
                color: '#FF8282', background: '#fff',
                borderRadius: '50%'
            }} color={"primary"} variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" style={{color: '#FF8282'}} component="div" color="error">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

export default function CircularStatic(progress: any) {
    // console.log(progress.progress)
    return <CircularProgressWithLabel value={Number(progress.progress)}/>;
}
