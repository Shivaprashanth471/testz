import * as Yup from "yup";
import "./ReferenceAddComponent.scss";


export const referenceValidation = Yup.object({
    name: Yup.string()
        .typeError("must be text")
        .min(3, "min 3 chracters")
        .max(50, 'max limit 50')
        .trim("The contact name cannot include leading and trailing spaces")
        .required("required"),
    jobTitle: Yup.string()
        .typeError("must be text")
        .max(50, 'max limit 50')
        .trim("The contact name cannot include leading and trailing spaces")
        .required("required"),
    contactNumber: Yup.string()
        .min(10, "min 10 digits")
        .max(10, "max 10 digits")
        .required("required")
        .matches(
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            "Invalid"
        ),
    email: Yup.string()
        .typeError("must be date")
        .email("invalid")
});