import * as Yup from "yup";
import "./ReferenceAddComponent.scss";


export const referenceValidation = Yup.object({
    name: Yup.string()
        .typeError("must be text")
        .min(3, "min 3 chracters")
        .max(50, 'max limit 50')
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .trim("The contact name cannot include leading and trailing spaces")
        .required("required"),
    jobTitle: Yup.string()
        .typeError("must be text")
        .max(50, 'max limit 50')
        .trim("The contact name cannot include leading and trailing spaces")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required("required"),
    contactNumber: Yup.string()
        .min(10, "min 10 digits")
        .max(10, "max 10 digits")
        .required("required"),
    email: Yup.string()
        .typeError("must be text")
        .max(50, 'max limit 50')
        .email("invalid")
});