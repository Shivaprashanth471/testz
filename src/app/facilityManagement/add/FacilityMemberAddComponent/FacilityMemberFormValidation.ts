import * as Yup from "yup";


export const memberFormValidation = Yup.object({
    name: Yup.string()
        .typeError("must be text")
        .min(3, "min 3 letters")
        .max(30, "max limit 30")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .trim("The contact name cannot include leading and trailing spaces")
        .required('required'),
    email: Yup.string().typeError("must be text").email("invalid").max(30, 'max limit 30'),
    phone_number: Yup.string()
        .typeError(" must be a number")
        .matches(/^[0-9]+$/, "must be number")
        .trim("empty space not allowed")
        .min(10, 'min 10 digits')
        .max(10, 'max 10 digits')
        .required("required"),
    extension_number: Yup.string()
        .matches(/^[0-9]+$/, "must be number")
        .trim("empty space not allowed")
        .min(1, 'min 1 digit')
        .max(10, 'max 10 digits')
        .required("required"),
    designation: Yup.string().min(2, "min 2 letters").typeError("must be text").required('required').max(30, 'max limit 30'),
});