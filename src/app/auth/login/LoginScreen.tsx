import React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import "./LoginScreen.scss";
// import { Link } from "react-router-dom";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { ENV } from "../../../constants";
import IconButton from "@material-ui/core/IconButton";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CommonService from "../../../helpers/common-service";
import { loginUser } from "../../../store/actions/auth.action";
import EmailIcon from '@material-ui/icons/Email';


const loginFormValidation = Yup.object({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required").min(6, "Password should be minimum 6 characters"),
});


const LoginScreen = (props: any) => {
  const dispatch = useDispatch();
  const [values, setValues] = React.useState({
    showPassword: false,
  });
  const onLogin = (
    payload: any,
    { setSubmitting, setErrors }: FormikHelpers<any>
  ) => {
    CommonService._api
      .post(ENV.API_URL + "user/login", payload)
      .then((resp) => {
        setSubmitting(false);
        dispatch(loginUser(resp.data.user, resp.data.token));
        // dispatch(setImageUrl(resp.data.info.logo));
      })
      .catch((err) => {
        CommonService.handleErrors(setErrors, err);
        // console.log(err);
        //CommonService.showToast(err.error || 'Error', 'error');
        setSubmitting(false);
      });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="main-auth-wrapper login-screen screen pdd-0">
      <div className="">
        <div className="auth-header">Sign in to Continue</div>
        <p className={"form-label"}>Please Enter your Details below</p>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validateOnChange={true}
        validationSchema={loginFormValidation}
        onSubmit={onLogin}
      >
        {({ isSubmitting, isValid }) => (

          <Form className={"loginFormHolder form-holder"}>
            <div className="form-field position-relative">
              <FormLabel className={"form-label"}>Email</FormLabel>
              <Field
                name="email"
                type={"email"}
                component={TextField}
                size={"small"}
                variant={"outlined"}
                id={"login_username"}
                color={"primary"}
                placeholder={"Enter the Email"}
                className="input-cursor"
              />
              <div className={"eye_btn_wrapper"}>
                <IconButton
                  size={"small"}
                  aria-label="toggle password visibility"
                  id="login_password_show_hide_btn"
                >
                  <EmailIcon />
                </IconButton>
              </div>
            </div>

            <div className="form-field position-relative">
              <FormLabel className={"form-label"}>Password</FormLabel>
              <Field
                name={"password"}
                component={TextField}
                type={values.showPassword ? "text" : "password"}
                placeholder={"Enter the Password"}
                max={16}
                id={"login_password"}
                variant={"outlined"}
                color={"primary"}
                className="input-cursor"
              />
              <div className={"eye_btn_wrapper"}>
                <IconButton
                  size={"small"}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  id="login_password_show_hide_btn"
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </div>
            </div>

            {/* <div className="form-link">
              <div className="forgot-password-holder" id="link_forgot_password">
                <Link className="forgot-password-wrapper" to="/forgot-password">
                  Forgot Password ?
                </Link>
              </div>
            </div> */}
            <div className="form-field mrg-top-40 position-relative">
              <Button
                disabled={isSubmitting || !isValid}
                fullWidth
                style={{ width: "100%" }}
                variant={"contained"}
                id="login_button"
                type={"submit"}
                size={"medium"}
                className={isSubmitting ? 'login-button has-loading-spinner' : 'login-button'}
              >
                  { isSubmitting ? "Logging in" : "Login" }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginScreen;
