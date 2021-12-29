import { Button } from '@material-ui/core';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React from 'react';
import * as Yup from "yup";
import './FacilityTaskAddComponent.scss';


const formValidation = Yup.object({
    title: Yup.string().required('Required'),
    priority: Yup.string().required('Required'),
    date: Yup.date().required('Required'),
    time: Yup.string().required('Required'),
    assign: Yup.string().required('Required'),
    task: Yup.string().required('Required')
})


const taskFormState = { title: '', priority: '', date: "", time: "", assign: "", task: "" }

const FacilityTaskAddComponent = (props: any) => {
    const { setIsList } = props
    const onAdd = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {


        setIsList(false)

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
        <div className="custom-card" >
            <Formik initialValues={taskFormState} validateOnChange={true}
                validationSchema={formValidation} onSubmit={onAdd}>
                {({ isSubmitting, isValid, resetForm }) => (<Form className={'form-holder'}>
                    <div className="flex">
                        <div className="form-field">
                            <Field name='title' type={'text'} component={TextField} variant={"outlined"} id="input_notes_add_title"
                                color={"primary"} className="search-cursor" fullWidth
                                placeholder={'Enter Title'} autoComplete="off" />
                        </div>
                        <div className="form-field">
                            <Field name='priority' type={'text'} component={TextField} variant={"outlined"} id="input_notes_add_priority"
                                color={"primary"} className="search-cursor" fullWidth
                                placeholder={'set priority'} autoComplete="off" />
                        </div>
                    </div>
                    <div className="flex mrg-top-10">
                        <div className="form-field">
                            <Field name='date' type={'date'} component={TextField} variant={"outlined"} id="input_notes_add_date"
                                color={"primary"} className="search-cursor" fullWidth
                                placeholder={'Select Date'} autoComplete="off" />
                        </div>
                        <div className="form-field">
                            <Field name='time' type={'time'} component={TextField} variant={"outlined"} id="input_notes_add_time"
                                color={"primary"} className="search-cursor" fullWidth
                                placeholder={'Select Time'} autoComplete="off" />
                        </div>
                    </div>

                    <div className="flex mrg-top-10">
                        <div className="form-field">
                            <Field name='assign' type={'text'} component={TextField} variant={"outlined"} id="input_notes_add_title"
                                color={"primary"} className="search-cursor" fullWidth
                                placeholder={'Select AM'} autoComplete="off" />
                        </div>
                        <div className="form-field">

                        </div>
                    </div>
                    <div className="mrg-top-10">
                        <div className="form-field">
                            <Field component={TextField}
                                type={"text"}
                                name="task"
                                fullWidth
                                multiline
                                rows={5}
                                placeholder="Task Content"
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


export default FacilityTaskAddComponent;