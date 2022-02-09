import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface VitawerksConfirmComponentProps {
    confirmationText: any;
    cancel: any;
    confirm: any;
    notext: string;
    yestext: string;
    text1: string;
    hcpname: string;
    groupname: string;
    isConfirm :boolean;
}

const VitawerksConfirmComponent = (props: PropsWithChildren<VitawerksConfirmComponentProps>) => {
    return <div className='pdd-20 pdd-top-20 pdd-bottom-40'>
        <DialogTitle id="alert-dialog-slide-title"
            className={'alert-dialog-slide-title '}>
            <div className='d-flex'>
                <p className='text1'>{props?.text1}</p>{props?.hcpname!=="" && <p className='hcpname'>&nbsp; "{props?.hcpname}"</p>}{props?.confirmationText && <p  className='text1'>&nbsp; {props?.confirmationText} </p>}{props?.groupname && <p  className='text1'>&nbsp; {props?.groupname}</p>}<p className='text1'>&nbsp; ?</p>
            </div>
        </DialogTitle>
        <DialogActions className={'pdd-20 mrg-top-40'}>
            <Button onClick={props?.cancel} variant={"outlined"} color={'primary'} className='pdd-left-25 pdd-right-25'>
                {props?.notext || 'No, Cancel'}
            </Button>
            <Button onClick={props?.confirm} variant={"contained"} color={'primary'} disabled={props?.isConfirm} className={props?.isConfirm?'has-loading-spinner':''}>
                {props?.yestext || 'Yes, Confirm'}
            </Button>
        </DialogActions>
    </div>;
}

export default VitawerksConfirmComponent;