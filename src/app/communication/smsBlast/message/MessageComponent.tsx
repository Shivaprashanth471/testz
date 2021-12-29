import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './MessageComponent.scss';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));


const MessageComponent = () => {
    const classes = useStyles();
    const data = ["one", "two", "three", "four"]
    return <div className={classes.root}>
        <div className="message-recipients d-flex">
            {data.map((item) => {
                <Chip
                    // icon={<FaceIcon />}
                    label={item}
                    //  onClick={handleClick}
                    //  onDelete={handleDelete}
                    variant="outlined"
                />
            })}
        </div>
    </div>
}


export default MessageComponent;