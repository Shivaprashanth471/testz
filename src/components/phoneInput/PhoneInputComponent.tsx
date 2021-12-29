import PhoneInput from "react-phone-number-input";
import { ErrorMessage, FieldProps } from "formik";
import React from "react";

interface PhoneInputComponentProps {
    field: FieldProps,
    placeholder?: string,
    international?: boolean
}

const PhoneInputComponent = (props: PhoneInputComponentProps) => {
    const { field, form } = props.field;
    const { placeholder } = props;
    const international = props.international === undefined ? false : props.international;
    return (
        <div className={'position-relative'}><PhoneInput
            inputMode={"tel"} className={'tel-input-holder'}
            international={international}
            defaultCountry="US"
            placeholder={placeholder}
            value={field.value}
            onBlur={
                (event) => {
                    field.onBlur(event);
                    form.setFieldTouched(field.name);
                }
            }
            onChange={
                (phoneVal) => {
                    form.setFieldTouched(field.name);
                    if (phoneVal) {
                        form.setFieldValue(field.name, phoneVal);
                    }
                }
            }
            type={'text'}
        />
            <ErrorMessage name={field.name}
                className={'form-error MuiFormHelperText-root MuiFormHelperText-contained Mui-error'}
                component="div" />
        </div>
    )
}
export default PhoneInputComponent;