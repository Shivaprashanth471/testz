import { Button, CircularProgress, Paper } from '@material-ui/core';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-material-ui';
import moment from 'moment';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import * as Yup from "yup";
import { ENV } from '../../../../constants';
import { ApiService, CommonService } from '../../../../helpers';
import { StateParams } from '../../../../store/reducers';
import './CreateShiftScreen.scss'


export interface AddHcpToShiftComponentProps {
    cancel: () => void,
    confirm: () => void,
    hcpId: string,
    applicationId: string,
}

interface CreateShiftItem {
    start_date: any,
    end_date: any,
    start_time: any;
    end_time: any;
    differential_amount: number;
    hcp_user_id?: string;
    application_id?: string;
    created_by?: string;
}

const hcpFormValidation = Yup.object({
    start_date: Yup.string()
        .required("required"),
    end_date: Yup.string()
        .required("required"),
    start_time: Yup.string()
        .required("required"),
    end_time: Yup.string()
        .required("required"),
    differential_amount: Yup.number()
        .typeError(" must be a Number"),
    created_by: Yup.string()
        .required("required"),
    hcp_user_id: Yup.string(),
    application_id: Yup.string(),
})

const CreateShiftScreen = (props: PropsWithChildren<AddHcpToShiftComponentProps>) => {

    const params = useParams<{ id: string }>();
    const { id } = params;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const [data, setData] = useState<any>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const user: any = localStorage.getItem("currentUser");
    let currentUser = JSON.parse(user);
    const userDetails = useSelector((state: StateParams) => state.auth.user);

    const { start_time, end_time } = CommonService.getUtcTimeinHours(data?.shift_timings?.start_time, data?.shift_timings?.end_time)
    const start_date = CommonService.getUtcDate(data?.shift_timings?.start_time)
    const end_date = CommonService.getUtcDate(data?.shift_timings?.end_time)

    let createShiftState: CreateShiftItem = {
        start_date: start_date && moment(start_date).format("YYYY-MM-DD"),
        end_date: end_date && moment(end_date).format("YYYY-MM-DD"),
        start_time: start_time,
        end_time: end_time,
        differential_amount: 0,
        hcp_user_id: props?.hcpId,
        application_id: props?.applicationId,
        created_by: currentUser._id,
    }

    const init = useCallback(() => {
        CommonService._api
            .get(ENV.API_URL + `shift/requirement/${id}`)
            .then((resp) => {
                setData(resp?.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [id]);


    const cancel = (resetForm: any) => {
        if (afterCancel) {
            afterCancel();
        }
    }

    useEffect(() => {
        init()
    }, [init])

    const createShiftApi = useCallback((createShift: any, setSubmitting: any) => {
        ApiService.post(ENV.API_URL + `shift/requirement/${data?._id}/shift`, createShift).then((resp: any) => {
            if (resp) {
                CommonService.showToast(resp?.msg || "Success", "success");
                if (afterConfirm) {
                    afterConfirm();
                }

            } else {
                setSubmitting(false);
            }
        })
            .catch((err) => {
                console.log(err);
                setSubmitting(false);
                CommonService.showToast(err?.msg || "Error", "error");
            });
    }, [afterConfirm, data?._id])

    const onAdd = (shift: CreateShiftItem, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {

        if (CommonService.convertHoursToMinutes(shift.start_time) === CommonService.convertHoursToMinutes(shift.end_time)) {
            CommonService.showToast("Shift Start Time and End Time Can't be Same", 'info')
            setSubmitting(false)
            return
        }

        const createdShift = {
            hcp_user_id: shift?.hcp_user_id,
            application_id: shift?.application_id,
            differential_amount: Number(shift?.differential_amount),
            created_by: shift?.created_by,
            start_time: CommonService.convertHoursToMinutes(shift.start_time),
            start_date: shift?.start_date,
            end_time: CommonService.convertHoursToMinutes(shift?.end_time),
            end_date: shift?.end_date
        }
        // console.log(createdShift)
        const approvePayload = {
            "approved_by": userDetails?._id
        }

        CommonService._api.patch(ENV.API_URL + 'shift/requirement/' + id + '/application/' + props?.applicationId + '/approve', approvePayload).then((resp) => {
            createShiftApi(createdShift, setSubmitting)

        }).catch((err) => {
            CommonService.handleErrors(setErrors, err);
            setSubmitting(false);
        })

    };

    if (isLoading) {
        return <Paper>
            <div className="pdd-30 screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="view-loading-indicator">
                    <CircularProgress color="secondary" className="loader" />
                </div>
            </div>
        </Paper>
    }

    return <Paper >
        {
            !isLoading && <div className='create-shift mrg-20 pdd-20'>
                <h2>Create Shift</h2>
                <Formik
                    initialValues={createShiftState}
                    validateOnChange={true}
                    validationSchema={hcpFormValidation}
                    onSubmit={onAdd}
                >
                    {({ isSubmitting, isValid, resetForm }) => (
                        <Form>
                            <div className='input-container mrg-top-40'>
                                <Field
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                    name="start_date"
                                    component={TextField}
                                    label="Start Date*"
                                    fullWidth
                                />
                                <Field
                                    type='time'
                                    InputLabelProps={{ shrink: true }}
                                    name="start_time"
                                    component={TextField}
                                    label="Start Time*"
                                    fullWidth
                                />
                            </div>
                            <div className='input-container mrg-top-40'>
                                <Field
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                    name="end_date"
                                    component={TextField}
                                    label="End Date*"
                                    fullWidth
                                />
                                <Field
                                    type='time'
                                    InputLabelProps={{ shrink: true }}
                                    name="end_time"
                                    component={TextField}
                                    label="End Time*"
                                    fullWidth
                                />
                            </div>
                            <div className='input-container mrg-top-40'>
                                <Field
                                    InputLabelProps={{ shrink: true }}
                                    name="differential_amount"
                                    type={"text"}
                                    component={TextField}
                                    label="Differential Amount*"
                                    fullWidth

                                />
                            </div>

                            <div className='create-shift-actions mrg-top-40' >
                                <Button variant='outlined' size='large' color="secondary" id="create-shift-cancel-btn" onClick={cancel}>Cancel</Button>
                                <Button
                                    disabled={isSubmitting || !isValid}
                                    type="submit"
                                    size="large"
                                    id="btn_hcp_edit_submit"
                                    variant={"contained"}
                                    className={isSubmitting ?"normal has-loading-spinner":"normal"}
                                    color={"primary"}>{!isSubmitting?"CREATE":"CREATING"}</Button>
                            </div>
                        </Form>)}
                </Formik>
            </div>
        }

    </Paper>

}


export default CreateShiftScreen;