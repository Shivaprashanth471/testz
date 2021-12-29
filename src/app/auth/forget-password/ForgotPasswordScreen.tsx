import React, { useCallback, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import CommonService from "../../../helpers/common-service";
import { ENV } from "../../../constants";
import { Link } from "react-router-dom";
import ErrorComponent from "../../../components/core/ErrorComponent";
import { CheckCircle } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import './ForgotPasswordScreen.scss'

const forgotPasswordFormValidation = Yup.object({
  phone: Yup.string().required("Required"),
});

const restPasswordFormValidation = Yup.object({
  password: Yup.string()
    .required("Required")
    .min(4, "Invalid")
    .max(16, "Invalid"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  code: Yup.string().required("Required").min(6, "Invalid").max(6, "Invalid"),
});

const ForgotPasswordScreen = (props: any) => {
  // const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"reset" | "code" | "password" | "changed">(
    "reset"
  );
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);
  const onSendResetLink = useCallback(
    (payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
      CommonService._api
        .post(ENV.API_URL + "admin/forgotPassword", payload)
        .then((resp) => {
          // console.log(resp);
          setSubmitting(false);
          if (resp.success) {
            setPhone(payload.phone);
            setMode("code");
            CommonService.showToast(resp.msg || "Reset Code Sent");
          } else {
            CommonService.showToast(
              resp.error || "Oops.. Something went wrong!"
            );
          }
        })
        .catch((err) => {
          CommonService.handleErrors(setErrors, err);
          setSubmitting(false);
        });
    },
    []
  );

  const onSetPassword = useCallback(
    (payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
      payload.phone = phone;
      CommonService._api
        .post(ENV.API_URL + "admin/resetPassword", payload)
        .then((resp) => {
          // console.log(resp);
          setSubmitting(false);
          if (resp.success) {
            setMode("changed");
          } else {
            CommonService.showToast(
              resp.error || "Oops.. Something went wrong!"
            );
          }
        })
        .catch((err) => {
          CommonService.handleErrors(setErrors, err);
          setSubmitting(false);
        });
    },
    [phone]
  );
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="main-auth-wrapper forgotPassword-screen screen">
      {mode === "reset" && (
        <>
          <div className="mrg-left-20">
            <div className="auth-header">Forgot Your Password ?</div>
            <p className={"form-label"}>
              Please enter the email address associated with your account and we
              will email you a OTP to reset your password.
            </p>
          </div>
          <Formik
            initialValues={{ phone: "" }}
            validateOnChange={true}
            validationSchema={forgotPasswordFormValidation}
            onSubmit={onSendResetLink}
          >
            {({ isSubmitting, values, isValid }) => (
              <Form className={"forgot-password-holder form-holder"}>
                <div className="form-field">
                  <Field
                    variant={"outlined"}
                    color={"primary"}
                    placeholder={"Enter Email Address"}
                    component={TextField}
                    type={"email"}
                    fullWidth
                    autoComplete="off"
                    name="email"
                  />
                </div>

                <div
                  className="form-field btns-holder"
                  style={{ justifyContent: "center" }}
                >
                  <Button
                    size="medium"
                    fullWidth
                    style={{ width: "100%" }}
                    className="otp-btn"
                    disabled={isSubmitting || !isValid}
                    variant={"contained"}
                    type={"submit"}
                  >
                    Send OTP
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
      {mode === "code" && (
        <>
          <div className="mrg-left-20">
            <div className="auth-header">Forgot Your Password ?</div>
            <p className={"form-label"}>
              Please enter the email address associated with your account and we
              will email you a OTP to reset your password.
            </p>
          </div>
          <Formik
            initialValues={{ phone: "" }}
            validateOnChange={true}
            validationSchema={forgotPasswordFormValidation}
            onSubmit={onSendResetLink}
          >
            {({ isSubmitting, values, isValid }) => (
              <Form className={"forgot-password-holder form-holder"}>
                <div className="form-field">
                  <Field
                    variant={"outlined"}
                    color={"primary"}
                    placeholder={"Enter OTP"}
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="email"
                  />
                </div>
                <p className="resend-otp">Resend OTP</p>
                <div
                  className="form-field btns-holder"
                  style={{ justifyContent: "center" }}
                >
                  <Button
                    size="medium"
                    fullWidth
                    style={{ width: "100%" }}
                    className="otp-btn"
                    disabled={isSubmitting || !isValid}
                    variant={"contained"}
                    type={"submit"}
                  >
                    Confirm
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
          <div className="mrg-left-20">
            <div className="auth-header">Forgot Your Password ?</div>
            <p className={"form-label"}>
              Please enter the email address associated with your account and we
              will email you a OTP to reset your password.
            </p>
          </div>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validateOnChange={true}
            validationSchema={restPasswordFormValidation}
            onSubmit={onSetPassword}
          >
            {({ isSubmitting, isValid }) => (
              <Form className={"forgot-password-holder form-holder"}>
                <div className="form-field position-relative">
                  <Field
                    name="password"
                    type={showNewPassword ? "text" : "password"}
                    component={TextField}
                    variant={"outlined"}
                    color={"primary"}
                    autoComplete="off"
                    id="input_new_password"
                    placeholder={"Enter New Password"}
                  />
                  <div className={"eye_btn_wrapper"}>
                    <IconButton
                      size={"small"}
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      id="btn_new_password_show"
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </IconButton>
                  </div>
                </div>
                <div className="form-field position-relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    component={TextField}
                    variant={"outlined"}
                    color={"primary"}
                    autoComplete="off"
                    id="input_confirm_password"
                    placeholder={"Confirm Password"}
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
                      {showConfirmPassword ? "Hide" : "Show"}
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
                    className="otp-btn"
                    disabled={isSubmitting || !isValid}
                    variant={"contained"}
                    type={"submit"}
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
      {mode === "changed" && (
        <div style={{ marginTop: 10 }}>
          <ErrorComponent
            icon={
              <CheckCircle
                color={"primary"}
                style={{ fontSize: 120, color: "green" }}
              />
            }
            text={"Password Reset Complete!"}
          />
          <div className="form-link">
            <div className="forgot-password-holder">
              <Button
                component={Link}
                color={"primary"}
                variant={"contained"}
                to="/login"
              >
                Back To Log In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;
