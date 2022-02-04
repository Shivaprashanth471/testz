import moment from "moment";
import * as Yup from "yup";


export const experienceValidation = Yup.object({
    facilityName: Yup.string()
        .typeError("must be text")
        .min(3, "min 3 chracters")
        .trim("")
        .max(50, 'max limit 50')
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required("required"),
    speciality: Yup.string()
        .typeError("must be text")
        .max(100, 'max limit 100')
        .trim("")
        .required("required"),
    hcpType: Yup.string()
        .typeError("must be number")
        .max(50, 'max limit 50')
        .trim()
        .required("required"),
    location: Yup.string().typeError("must be date").trim().max(50, 'max limit 50').required("required"),
    startDate: Yup.date().nullable(),
    endDate: Yup.date().min(
        Yup.ref('startDate'),
        "End Date can not be less than Start Date"
    ).nullable().test('endDate', 'Start Date can not be same as End Date', function (item) {
        let endDate, startDate
        if (this.parent.endDate) {
            endDate = moment(this.parent.endDate).format('L')
        }
        if (this.parent.startDate) {
            startDate = moment(this.parent.startDate).format('L')
        }

        if (endDate && startDate) {
            let isSame = moment(endDate).isSame(startDate)
            return !isSame
        }

        return true
    }),
    stillWorkingHere: Yup.string().trim().required("required"),
    skills: Yup.string().trim().max(100, 'max limit 100')
});