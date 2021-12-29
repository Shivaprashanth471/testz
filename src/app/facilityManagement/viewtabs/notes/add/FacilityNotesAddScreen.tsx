import { Button } from '@material-ui/core';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React from 'react';
import * as Yup from "yup";
// import CommonService from "../../../../../helpers/common-service";
import './FacilityNotesAddScreen.scss';


const formValidation = Yup.object({
    title: Yup.string().required('Required'),
    note: Yup.string().required('Required')
})

const FacilityNotesAddScreen = (props: any) => {
    // const history = useHistory()
    const { setIsList, setNotes, notes } = props

    const onAdd = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {
        console.log(payload)
        setNotes([...notes, payload])
        setSubmitting(false)
        resetForm()
        setIsList((prevState: boolean) => !prevState)

        // CommonService._api.post(ENV.API_URL + 'member', payload).then((resp) => {
        //     setSubmitting(false);

        // }).catch((err) => {
        //     CommonService.handleErrors(setErrors, err);
        //     setSubmitting(false);
        // })
    }

    const cancel = (resetForm: any) => {
        resetForm()
    }

    return <div className="facility-add-notes screen crud-layout">
        <div className='custom-card pdd-top-20'>
            <Formik initialValues={{ title: '', note: '' }} validateOnChange={true}
                validationSchema={formValidation} onSubmit={onAdd}>
                {({ isSubmitting, isValid, resetForm }) => (<Form className={'form-holder'}>

                    <div className="form-field">
                        <Field name='title' type={'text'} component={TextField} variant={"outlined"} id="input_notes_add_title"
                            color={"primary"} className="search-cursor" fullWidth
                            placeholder={'Enter Title'} autoComplete="off" />
                    </div>

                    <div className="mrg-top-20">
                        <div className="form-field">
                            <Field component={TextField}
                                type={"text"}
                                name="note"
                                fullWidth
                                multiline
                                rows={7}
                                placeholder="Note Content"
                                variant="outlined" />
                        </div>
                    </div>
                    <div className='btn-grp'>
                        <Button onClick={() => { cancel(resetForm); props.setIsList(true) }} variant='outlined' color="secondary" id="btn_notes_add_cancel">
                            {('Cancel')}
                        </Button>
                        <Button type={"submit"} className={"submit"} disabled={isSubmitting || !isValid} variant={"contained"} color="primary" autoFocus id="btn_notes_add_submit">
                            {('Add Note')}
                        </Button>
                    </div>
                </Form>)}
            </Formik>
        </div>
    </div>;
}

export default FacilityNotesAddScreen;