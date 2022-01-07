import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface LeavePageConfirmationComponentProps {
    confirmationText: any;
    cancel: any;
    confirm: any;
    notext: string;
    yestext: string;
}

const headerStyles: any = {
    textAlign: 'center'
}

const headingStyle: any = {
    color: '#1e1e1e',
}

const LeavePageConfirmationComponent = (props: PropsWithChildren<LeavePageConfirmationComponentProps>) => {
    return <div className='pdd-20 pdd-bottom-10'>
        <DialogTitle id="alert-dialog-slide-title"
            className={'alert-dialog-slide-title '} style={headerStyles}>
            <h2 style={headingStyle}>Leave Page?</h2>
            <p>Changes you made might not be saved</p>
        </DialogTitle>
        <DialogActions className={'pdd-20'}>
            <Button onClick={props?.cancel} size="large"
                variant={"outlined"}
                color={"primary"} className='pdd-left-25 pdd-right-25'>
                {props?.notext || 'Leave'}
            </Button>
            <Button onClick={props?.confirm} size="large"
                variant={"contained"}
                color={"primary"}>
                {props?.yestext || 'Cancel'}
            </Button>
        </DialogActions>
    </div>;
}

export default LeavePageConfirmationComponent;