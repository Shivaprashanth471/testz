import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';
import {Communications} from "../helpers";
import {TsConfirmationConfig} from "../constants/CommonTypes";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmComponent = () => {
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState<TsConfirmationConfig | null>(null);
    const [promise, setPromise] = useState<{ resolve: any, reject: any } | null>(null);

    useEffect(() => {
        const subscription = Communications.ConfirmStateSubject.subscribe(({config, promise}) => {
            setPromise(promise);
            setConfig(config);
            handleClickOpen();
        })
        return () => {
            subscription.unsubscribe();
        }
    }, [])
    const handleClickOpen = () => {
        setOpen(true);
    };

    const confirm = () => {
        promise?.resolve();
        handleClose();
    }
    const cancel = () => {
        promise?.reject();
        handleClose();
    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={cancel}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title"
                         className={'alert-dialog-slide-title'}>{config?.confirmationText || 'Confirm ?'}</DialogTitle>
            {/*<DialogContent>*/}
            {/*    <DialogContentText id="alert-dialog-slide-description">*/}
            {/*        Let Google help apps determine location. This means sending anonymous location data to*/}
            {/*        Google, even when no apps are running.*/}
            {/*    </DialogContentText>*/}
            {/*</DialogContent>*/}
            <DialogActions className={'pdd-20'}>
                <Button onClick={cancel} variant={"contained"} color={config?.no?.color || 'primary'}>
                    {config?.no?.text || 'No, Cancel'}
                </Button>
                <Button onClick={confirm} variant={"contained"} color={config?.yes?.color || 'default'}>
                    {config?.yes?.text || 'Yes, Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmComponent
