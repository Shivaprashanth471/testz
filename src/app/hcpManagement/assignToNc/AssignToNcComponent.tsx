import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ENV } from '../../../constants';
import { CommonService } from '../../../helpers';
import { useParams } from 'react-router';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

export interface AssignToNcComponentProps {
    cancel: () => void,
    confirm: () => void,
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
        assignNcActions: {
            margin: "auto",
            marginTop: "100px",
            textAlign: "center",
            justifyContent: "center"
        }
    }),
);

const AssignToNcComponent = (props: PropsWithChildren<AssignToNcComponentProps>) => {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const [selectedValue, setSelectedValue] = useState<string>('');
    const classes = useStyles();
    const [ncList, setNcList] = React.useState<any>(null);
    const [isApproved,setIsApproved] = React.useState(false);

    const init = useCallback(() => {
        // config
        CommonService._api.get(ENV.API_URL + 'user?role=nurse_champion').then((resp) => {
            setNcList(resp.data?.docs);
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const ApproveHcp=useCallback(()=>{
        CommonService._api.patch(ENV.API_URL + 'hcp/' + id+'/approve').then((resp) => {
            if (afterConfirm) {
                afterConfirm();
                setIsApproved(false)
                CommonService.showToast(resp.msg || 'Success', 'success');
            }
        }).catch((err) => {
            console.log(err)
            setIsApproved(false)
            CommonService.showToast(err || 'Error', 'error');
        })
    },[id,afterConfirm])

    const assignToNc = useCallback(() => {
        setIsApproved(true)
        let payload = {
            nurse_champion_id:selectedValue
        }
        CommonService._api.put(ENV.API_URL + 'hcp/' + id, payload).then((resp) => {
            ApproveHcp()
        }).catch((err) => {
            console.log(err)
            setIsApproved(false)
        })
    }, [selectedValue,id,ApproveHcp])

    const handleChange = (event:any) => {
        setSelectedValue(event.target.value);
      };

      const cancel = (resetForm: any) => {
        if (afterCancel) {
            afterCancel();
        }
    }

    useEffect(() => {
        init()
    }, [init])

    return <div>
        <div className={classes.paper}>
            <h2>Assign to NC</h2>
            {/* <TextField defaultValue={''} onChange={event => {}} variant={"outlined"} size={"small"} type={'text'} placeholder={'Search Nurse Champion'} /> */}

            <FormLabel component="legend">List Of Nurse Champions</FormLabel>
            <RadioGroup
                aria-label="gender"
                defaultValue="female"
                name="radio-buttons-group"
                className="mrg-top-30"
            >
                {
                    ncList?.map((item: any) => {
                        return (<FormControlLabel value={item?._id} control={<Radio />} onChange={(event)=>handleChange(event)} label={item?.first_name + " " + item?.last_name} />
                        )
                    })
                }
            </RadioGroup>
            <div className={classes.assignNcActions}>
                 <Button type={'submit'} size='large' variant={"outlined"} className={'normal'} onClick={cancel}>Cancel</Button>
                <Button type={'submit'} size='large' color={"secondary"} variant={"contained"} className={'normal mrg-left-30'} disabled={selectedValue==='' || isApproved} onClick={()=>assignToNc()}>Save</Button>
            </div>
        </div>
    </div>;
}

export default AssignToNcComponent;