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
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import './AssignToNcComponent.scss';

export interface AssignToNcComponentProps {
    cancel: () => void,
    confirm: () => void,
}

const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#10c4d3',
            },
        },
    },
})(TextField);

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
        },
        title: {
            fontWeight: 450
        },
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
    const [isApproved, setIsApproved] = React.useState(false);
    const [searchNc, setSearchNc] = useState<string>('')

    const init = useCallback(() => {
        let url = ENV.API_URL + 'user/lite?role=nurse_champion'
        if (searchNc !== '') {
            url = ENV.API_URL + 'user/lite?role=nurse_champion&search=' + searchNc
        }
        // config
        CommonService._api.get(url).then((resp) => {
            setNcList(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [searchNc])

    const ApproveHcp = useCallback(() => {
        CommonService._api.patch(ENV.API_URL + 'hcp/' + id + '/approve').then((resp) => {
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
    }, [id, afterConfirm])

    const assignToNc = useCallback(() => {
        setIsApproved(true)
        let payload = {
            nurse_champion_id: selectedValue
        }
        CommonService._api.put(ENV.API_URL + 'hcp/' + id, payload).then((resp) => {
            ApproveHcp()
        }).catch((err) => {
            console.log(err)
            setIsApproved(false)
        })
    }, [selectedValue, id, ApproveHcp])

    const handleChange = (event: any) => {
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
    return <div className='assign-nc'>
        <div className={classes.paper}>
            <h2 className={classes.title}>Assign to NC</h2>
            <FormLabel component="legend" className="mrg-left-0">List Of Nurse Champions</FormLabel>
            <div className='mrg-top-20'>
                <div>
                    <div className="d-flex">
                        <div className="d-flex position-relative">
                            <CssTextField defaultValue={''} onChange={event => { setSearchNc(event?.target?.value) }}
                                className="searchField"  variant={"outlined"} size={"small"} type={'text'} placeholder={'Search NC'} value={searchNc}
                            />
                            {searchNc === '' ?
                                <div className={"search_icon"}>
                                    <SearchRounded />
                                </div> : <div className={"search_icon"}><ClearIcon onClick={event => setSearchNc('')} id="clear_group_search" /></div>}
                        </div>
                    </div>
                </div>
            </div>
            <RadioGroup
                aria-label="gender"
                defaultValue="female"
                name="radio-buttons-group"
                className="mrg-top-10"
            >
                {
                    ncList?.map((item: any) => {
                        return (<FormControlLabel value={item?._id} control={<Radio />} onChange={(event) => handleChange(event)} label={item?.first_name + " " + item?.last_name} />
                        )
                    })
                }
            </RadioGroup>
            <div className={classes.assignNcActions}>
                <Button type={'submit'} size='large' variant={"outlined"} className={'normal'} onClick={cancel}>Cancel</Button>
                <Button type={'submit'} size='large' color={"secondary"} variant={"contained"} className={isApproved?'normal mrg-left-30 has-loading-spinner':'normal mrg-left-30'} disabled={selectedValue === '' || isApproved} onClick={() => assignToNc()}>{!isApproved?"Save":"Saving"}</Button>
            </div>
        </div>
    </div>;
}

export default AssignToNcComponent;