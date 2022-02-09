import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { useSelector } from 'react-redux';
import { StateParams } from '../../../../store/reducers';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { InputBase, RadioGroup } from 'formik-material-ui';
import { DialogActions, DialogContent } from '@material-ui/core';
import * as Yup from "yup";
import { PropsWithChildren } from 'react';
import { useParams } from 'react-router-dom';

const formValidation = Yup.object({
    reason: Yup.string().required("Required")
})

export interface RejectShiftComponentProps {
    cancel: () => void,
    confirm: () => void,
    selectedShifts: any,
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
            margin: "auto"
        },
        assignNcActions: {
            margin: "auto",
            marginTop: "100px",
            textAlign: "center",
            justifyContent: "center"
        },
        selectReason: {
            color: "#10c4d3 !important"
        }
    }),
);


const RejectShiftComponent = (props: PropsWithChildren<RejectShiftComponentProps>) => {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const classes = useStyles();
    const { user } = useSelector((state: StateParams) => state.auth);
    const reasonsList = ["No Show", "Nurse Cancelled", "Facility Cancelled", "Vitawerks Cancelled"];
    const selectedShifts = props?.selectedShifts;


    const onCancelShift = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {
        payload = {
            ...payload,
            cancelled_by: user?._id
        }

        CommonService._api.patch(ENV.API_URL + 'shift/' + id + '/cancel', payload).then((resp) => {
            setSubmitting(false);
            if (afterConfirm) {
                CommonService.showToast(resp?.msg || "Success", "success");
                afterConfirm();
                resetForm({})
            }
        }).catch((err) => {
            CommonService.handleErrors(setErrors, err);
            setSubmitting(false);
        })
    }

    const handleCancelMultipleShifts = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {
        payload = {
            ...payload,
            cancelled_by: user?._id,
            shift_ids: selectedShifts
        };

        CommonService._api.patch(ENV.API_URL + "shifts/cancel", payload).then((resp) => {
            setSubmitting(false);
            CommonService.showToast(resp?.msg || "Success", "success");
            if (afterConfirm) {
                afterConfirm();
                resetForm({});
            }
        })
            .catch((err) => {
                CommonService.handleErrors(setErrors, err);
                setSubmitting(false);
            });
    }

    const cancel = (resetForm: any) => {
        if (afterCancel) {
            afterCancel();
        }
    }

    return <div>
        <div className={classes.paper}>
            <h2>Rejection Request</h2>
            <Formik initialValues={{ reason: "" }} validateOnChange={true}
                validationSchema={formValidation}  onSubmit={selectedShifts?handleCancelMultipleShifts:onCancelShift}>
                {({ isSubmitting, isValid, resetForm, dirty }) => (<Form className={'form-holder'}>
                    <DialogContent>
                        <FormLabel component="legend" color={"primary"} className={classes.selectReason}>Select Reason</FormLabel>
                        <Field component={RadioGroup} name="reason" id="radio_reason_reject" className="mrg-top-20">
                            <>
                                {reasonsList?.map((item: any) => {
                                    return (<FormControlLabel
                                        value={item}
                                        control={<Radio disabled={isSubmitting} color={'primary'} />}
                                        label={item}
                                        id="radio_reason_add"
                                        className={"reson-div "}
                                        name="reason"
                                        disabled={isSubmitting}
                                    />
                                    )
                                })}
                            </>
                        </Field>
                        <Field
                            component={InputBase}
                            type={"text"}
                            name="reason"
                            fullWidth
                            multiline
                            rows={4}
                            className="mrg-top-20"
                            placeholder="If others please type the reason."
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions className="mrg-top-20">
                        <Button onClick={() => cancel(resetForm)} color="secondary" id="btn_reject_application" variant={"outlined"} className='pdd-left-30 pdd-right-30'>
                            {'Back'}
                        </Button>
                        <Button type={"submit"} id="btn_reject_application"
                            className={isSubmitting ? "submit has-loading-spinner" : "submit"}
                            disabled={!dirty || isSubmitting || !isValid} variant={"contained"} color="primary" autoFocus>
                            {isSubmitting ? "Cancelling Shift" : 'Cancel Shift'}
                        </Button>
                    </DialogActions>
                </Form>)}
            </Formik>

        </div>
    </div>;
}

export default RejectShiftComponent;