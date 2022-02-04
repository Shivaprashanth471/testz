import React, { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import CommonService from "../../../helpers/common-service";
import { ENV } from "../../../constants";
import { Link, useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import './ForgotPasswordScreen.scss';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { FormLabel } from "@material-ui/core";

let isEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,63}$')

const forgotPasswordFormValidation = Yup.object({
  email: Yup.string().email().matches(isEmail, "Invalid Email").required("Required")
});

const restPasswordFormValidation = Yup.object({
  password: Yup.string().required("Required").min(6, "Invalid").max(16, "Invalid"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Required"),
  code: Yup.string().required("Required").min(4, "Invalid").max(4, "Invalid"),
});

const ForgotPasswordScreen = (props: any) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"reset" | "password">("reset");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<any>(0);
  const [isSeconds, setIsSeconds] = useState<boolean>(false);
  const [isResendOtp, setIsResendOtp] = useState<boolean>(false)

  const onSendResetLink = useCallback((payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
    CommonService._api.post(ENV.API_URL + "forgotPassword", payload).then((resp) => {
      // console.log(resp);
      setSubmitting(false);
      if (resp.success) {
        setEmail(payload.email);
        setMode("password");
        setSeconds(60)
        CommonService.showToast(resp.msg || "Reset Code Sent");
      } else {
        CommonService.showToast(
          resp.error || "Oops.. Something went wrong!"
        );
      }
    }).catch((err) => {
      CommonService.handleErrors(setErrors, err);
      setSubmitting(false);
    });
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(myInterval)
        setSeconds(60);
        setIsSeconds(false)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds]);

  const ResendOTP = useCallback(() => {
    setIsResendOtp(true)
    let payload: any = {
      email: email
    }
    CommonService._api.post(ENV.API_URL + "forgotPassword", payload).then((resp) => {
      CommonService.showToast(resp.msg || "Reset Code Sent");
      setIsSeconds(true);
      setIsResendOtp(false);
      setSeconds(60);
    }).catch((err) => {
      CommonService.showToast(err.msg || "Error", "error");
      setSeconds(60);
      setIsSeconds(false);
      setIsResendOtp(false);
    });
  }, [email])

  const onSetPassword = useCallback((payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
    payload.email = email;
    CommonService._api.post(ENV.API_URL + "resetPassword", payload).then((resp) => {
        setSubmitting(false);
        if (resp.success) {
          CommonService.showToast(resp.msg || "Success", "success");
          history.push("/login");
        } else {
          CommonService.showToast(resp.error || "Oops.. Something went wrong!");
        }
      })
      .catch((err) => {
        CommonService.handleErrors(setErrors, err);
        setSubmitting(false);
      });
  }, [email, history]);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="main-auth-wrapper forgotPassword-screen screen pdd-0">
      {mode === "reset" && (
        <>
          <div className="">
            <div className="auth-header">Forgot Your Password ?</div>
            <p className={"form-label"}>
              Please enter the email address associated with your account and we
              will email you a OTP to reset your password.
            </p>
          </div>
          <Formik
            initialValues={{ email: "" }}
            validateOnBlur={true}
            validateOnChange={true}
            validationSchema={forgotPasswordFormValidation}
            onSubmit={onSendResetLink}
          >
            {({ isSubmitting, values, isValid }) => (
              <Form className={"forgot-password-holder form-holder"}>
                <div className="form-field">
                  <FormLabel className={"form-label"}>Email*</FormLabel>
                  <Field
                    variant={"outlined"}
                    color={"primary"}
                    placeholder={"Enter Email Address"}
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="email"
                  />
                </div>
                <div className="form-field btns-holder" style={{ justifyContent: "center" }}>
                  <Button
                    size="medium"
                    fullWidth
                    style={{ width: "100%" }}
                    className={isSubmitting ? "otp-btn has-loading-spinner" : "otp-btn"}
                    disabled={isSubmitting || !isValid}
                    variant={"contained"}
                    type={"submit"}
                  >
                    {isSubmitting ? "Sending OTP" : "Send OTP"}
                  </Button>
                </div>

                <div className="form-link">
                  <Link to={"/login"} className={"back-to-login-link"}>
                    Back
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
      {mode === "password" && (
        <>
          <div className="">
            <div className="auth-header">Forgot Your Password ?</div>
            <p className={"form-label"}>
              Please enter the email address associated with your account and we
              will email you a OTP to reset your password.
            </p>
          </div>
          <Formik
            initialValues={{ email: email, code: "", password: "", confirmPassword: "" }}
            validateOnChange={true}
            validationSchema={restPasswordFormValidation}
            onSubmit={onSetPassword}
          >
            {({ isSubmitting, isValid }) => (
              <Form className={"forgot-password-holder form-holder"}>
                <div className="form-field position-relative email-wrapper">
                  <FormLabel className={"form-label"}>Email*</FormLabel>
                  <p className="change-email-wrapper" onClick={() => setMode("reset")}>Change Email</p>
                  <Field
                    variant={"outlined"}
                    color={"primary"}
                    placeholder={"Enter Email Address"}
                    component={TextField}
                    type={"email"}
                    fullWidth
                    autoComplete="off"
                    name="email"
                    disabled
                  />

                </div>
                <div className="form-field position-relative email-wrapper">
                  <FormLabel className={"form-label"}>OTP*</FormLabel>
                  {isResendOtp ? <p className="change-email-wrapper">Resend OTP</p> :
                   isSeconds ? <p className="change-email-wrapper">{`Resend otp in ${seconds} seconds`}</p>:<p className="change-email-wrapper" onClick={ResendOTP}> {"Resend OTP"}</p>
                  }
                  <Field
                    variant={"outlined"}
                    color={"primary"}
                    placeholder={"Enter OTP"}
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="code"
                    inputProps={{ maxLength: 4 }}
                  />
                </div>
                <div className="form-field position-relative ">
                  <FormLabel className={"form-label"}>Password*</FormLabel>
                  <Field
                    name="password"
                    type={showNewPassword ? "text" : "password"}
                    component={TextField}
                    variant={"outlined"}
                    color={"primary"}
                    autoComplete="off"
                    id="input_new_password"
                    placeholder={"Enter New Password"}
                    inputProps={{ maxLength: 16 }}
                  />
                  <div className={"eye_btn_wrapper"}>
                    <IconButton
                      size={"small"}
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      id="btn_new_password_show"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </div>
                </div>
                <div className="form-field position-relative ">
                  <FormLabel className={"form-label"}>Confirm Password*</FormLabel>
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    component={TextField}
                    variant={"outlined"}
                    color={"primary"}
                    autoComplete="off"
                    id="input_confirm_password"
                    placeholder={"Confirm Password"}
                    inputProps={{ maxLength: 16 }}
                  />
                  <div className={"eye_btn_wrapper"}>
                    <IconButton
                      size={"small"}
                      aria-label="toggle password visibility"
                      id="btn_confirm_password_show"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </div>
                </div>
                <div
                  className="form-field btns-holder"
                  style={{ justifyContent: "center" }}
                >
                  <Button
                    size="medium"
                    fullWidth
                    style={{ width: "100%" }}
                    className={isSubmitting ? "otp-btn has-loading-spinner" : "otp-btn"}
                    disabled={isSubmitting || !isValid}
                    variant={"contained"}
                    type={"submit"}
                  >
                    {isSubmitting ? "Reseting Password" : "  Reset Password"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;