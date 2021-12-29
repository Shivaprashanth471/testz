import React, {PropsWithChildren} from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';
import {ClearRounded} from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogComponentProps {
    cancel: () => void,
    open: boolean,
    class?: string,
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const DialogComponent = (props: PropsWithChildren<DialogComponentProps>) => {

    const maxWidth = props.maxWidth || 'sm';
    // const [open, setOpen] = useState(false);
    // const [Component, setComponent] = useState<any | null>(null);
    // const [promise, setPromise] = useState<{ resolve: any, reject: any } | null>(null);

    // useEffect(() => {
    //     const subscription = Communications.DialogStateSubject.subscribe(({component, promise}) => {
    //         setPromise(promise);
    //         setComponent(component);
    //         handleClickOpen();
    //     })
    //     return () => {
    //         subscription.unsubscribe();
    //     }
    // }, []);
    //
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    //
    // const confirm = () => {
    //     promise?.resolve();
    //     handleClose();
    // }
    // const cancel = () => {
    //     promise?.reject();
    //     handleClose();
    // }
    // const handleClose = () => {
    //     setOpen(false);
    // };

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog
            maxWidth={maxWidth}
            open={props.open}
            TransitionComponent={Transition}
            className={'dialog-main-holder ' + (props.class || '')}
            onClose={props.cancel}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <div className={'close-btn-holder'}>
                <div
                    onClick={props.cancel} className={'close-btn-item'}>
                    <ClearRounded style={{fontSize: 30}} color={"primary"}/>
                </div>
            </div>
            {props.children}
            {/*{Component && <>*/}
            {/*    {*/}
            {/*        // @ts-ignore*/}
            {/*        ({component: Component}) => {*/}
            {/*            return (<Component confirm={confirm} cancel={cancel}/>)*/}
            {/*        }*/}
            {/*    }*/}
            {/*</>*/}
            {/*}*/}


        </Dialog>
    );
}

export default DialogComponent
