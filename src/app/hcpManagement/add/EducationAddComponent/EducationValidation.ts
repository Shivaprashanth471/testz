import moment from "moment";
import * as Yup from "yup";
import "./EducationAddComponent.scss";



export const educationValidation = Yup.object({
    institute_name: Yup.string()
        .typeError("must be text")
        .min(3, "min 3 chracters")
        .trim("empty space")
        .max(255, 'max limit 255')
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required(" required"),
    degree: Yup.string()
        .typeError("must be text")
        .trim("empty space")
        .max(255, 'max limit 255')
        .required(" required"),
    location: Yup.string()
        .typeError("must be text")
        .trim("empty space")
        .max(255, 'max limit 255')
        .required(" required"),
    start_date: Yup.date()
        .required("required").nullable(),
    graduation_date: Yup.date().min(
        Yup.ref('start_date'),
        "End Date can not be lesser than Start Date"
    ).nullable().required('required').test('grad_date', 'Start Date can not be same as End Date', function (item) {
        let end_date, start_date
        if (this.parent.graduation_date) {
            end_date = moment(this.parent.graduation_date).format('L')
        }
        if (this.parent.start_date) {
            start_date = moment(this.parent.start_date).format('L')
        }

        if (end_date && start_date) {
            let isSame = moment(end_date).isSame(start_date)
            return !isSame
        }

        return true
    }),
});