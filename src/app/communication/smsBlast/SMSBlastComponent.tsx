import { Button, Chip, Tooltip } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import "./SendSmsBlastScreen.scss";

const SMSBlastComponent = (props: any) => {
    return (
      <>
        <div className="sms-blast-recipients">
          <h3>To</h3>
          <div className="selected-recipients">
            {props.selectedGroups.length > 0 ? (
              props.selectedGroups.map((data: any) => {
                return <Chip style={{ background: "#E3FFF4" }} key={data?._id} label={data.title} onDelete={() => props.handleDelete(data)} />;
              })
            ) : (
              <p>No Recipients Added</p>
            )}
          </div>
        </div>
        <div className="sms-blast-message pdd-right-20">
          <Formik
            initialValues={{
              message: "",
              title: "",
            }}
            validateOnChange={true}
            validationSchema={props.smsValidation}
            onSubmit={props.onAdd}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="form-holder">
                <Field component={TextField} fullWidth name="title" variant="outlined" placeholder="Type a Title*" autoComplete="off" />
                <Field autoComplete="off" className="mrg-top-20" component={TextField} fullWidth multiline name="message" rows={6} variant="outlined" placeholder="Type in your message*" />
                <div className="sms-blast-btn mrg-top-20">
                  <Tooltip title={isSubmitting ? "Sending Blast" : "Send Blast"}>
                    <Button disabled={isSubmitting || !isValid} color={"primary"} variant={"contained"} id="sms_blast_button" className={isSubmitting ? "has-loading-spinner" : ""} type="submit" size={"large"}>
                      {isSubmitting ? "Sending Blast" : "Send Blast"}
                    </Button>
                  </Tooltip>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  };

  export default SMSBlastComponent