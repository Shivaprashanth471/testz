import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import { useParams } from 'react-router';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { useSelector } from 'react-redux';
import { StateParams } from '../../../../store/reducers';
import Checkbox from '@material-ui/core/Checkbox';
import animationData from "../../../../animations/no_data.json";
import './AddHcpToShiftScreen.scss';
import Lottie from "react-lottie";

export interface AddHcpToShiftComponentProps {
    cancel: () => void,
    confirm: () => void,
    hcp_type: any,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(3),
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: "30px 50px",
            margin: "auto",
        },
        title: {
            fontWeight: 450
        },
        assignNcActions: {
            margin: "auto",
            marginTop: "100px",
            textAlign: "center",
            justifyContent: "center"
        }
    }),
);


const AddHcpToShiftScreen = (props: PropsWithChildren<AddHcpToShiftComponentProps>) => {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const afterCancel = props?.cancel;
    const hcp_type = props?.hcp_type;
    const afterConfirm = props?.confirm;
    const [selectedHcps, setSelectedHcps] = useState<any>([]);
    const classes = useStyles();
    const [hcpList, sethcpList] = React.useState<any>(null);
    const { user } = useSelector((state: StateParams) => state.auth);
    const [isSubmitting, setSubmitting] = useState<boolean>(true)


    const defaultOptions = {
        animationData
    };

    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'hcp/lite?is_approved=1&hcp_type=' + hcp_type).then((resp) => {
            sethcpList(resp?.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [hcp_type])

    const addHcpToshift = useCallback((hcp_id) => {
        setSubmitting(false)
        let payload = {
            hcp_user_id: hcp_id, applied_by: user?._id
        }
        CommonService._api.post(ENV.API_URL + 'shift/requirement/' + id + '/application', payload).then((resp) => {
            CommonService.showToast(resp?.msg || 'Success', 'success');
            if (afterConfirm) {
                setSubmitting(true)
                afterConfirm();
            }
        }).catch((err) => {
            console.log(err)
            CommonService.showToast(err.error || 'Error', 'error');
            setSubmitting(true)
        })
    }, [id, user?._id, afterConfirm])

    const addAllHcpToshift = useCallback(() => {
        selectedHcps.map((item: any) => addHcpToshift(item))
    }, [selectedHcps, addHcpToshift])

    const handleChange = (event: any) => {
        let index = selectedHcps.indexOf(event.target.value)
        let tempHcps = []
        if (index > -1) {
            tempHcps = selectedHcps.filter((item: any) => item !== event.target.value)
        } else {
            tempHcps = [...selectedHcps, event.target.value]
        }
        setSelectedHcps(tempHcps);
    };

    console.log(selectedHcps)
    const cancel = (resetForm: any) => {
        if (afterCancel) {
            afterCancel();
        }
    }

    useEffect(() => {
        init()
    }, [init])

    return <div className='add-hcp-requirment'>
        <div className={classes.paper}>
            <h2 className={classes.title}>Add HCP to this Shift</h2>
            {/* <TextField defaultValue={''} onChange={event => {}} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Nurse Champion'} /> */}
            {hcpList && hcpList.length > 0 ? <div id='alert-dialog-title'>
                <FormLabel component="legend" className="mrg-left-0">List Of HCP'S</FormLabel>
                <div className="mrg-top-20">
                    {
                        hcpList?.map((item: any) => {
                            return (<div><FormControlLabel value={item?.user_id} control={<Checkbox />} onChange={(event) => handleChange(event)} label={item?.first_name + " " + item?.last_name} />
                            </div>)
                        })

                    }
                </div>
            </div> : <div className={'display-flex flex-one mrg-top-20 mrg-bottom-20'}>
                <Lottie
                    width={700}
                    height={400}
                    speed={1}
                    options={defaultOptions}
                />
            </div>}
            {hcpList && hcpList.length > 0 ?
                <div className={classes.assignNcActions}>
                    <Button type={'submit'} size='large' variant={"outlined"} className={'normal'} onClick={cancel}>Cancel</Button>
                    <Button type={'submit'} color={"primary"} size='large' disabled={!isSubmitting} variant={"contained"} className={'mrg-left-30'} onClick={() => addAllHcpToshift()}>Add HCP</Button>
                </div> : <></>}
        </div>
    </div>;
}


export default AddHcpToShiftScreen;