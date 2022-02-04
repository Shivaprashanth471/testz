import moment from "moment";
import * as Yup from "yup";

export const volunteerExperienceValidation = Yup.object({
  organisation: Yup.string()
    .typeError("must be text")
    .min(3, "min 3 letter")
    .trim("")
    .max(50, "max limit 50")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("required"),
  stillWorkingHere: Yup.string().trim().required("required"),
  speciality: Yup.string()
    .typeError("must be text")
    .trim("")
    .max(100, "max limit 100")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("required"),
  positionTitle: Yup.string()
    .typeError("must be text")
    .trim()
    .max(50, "max limit 50")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("required"),
  location: Yup.string().typeError("must be date").trim().max(50, "max limit 50").required("required"),
  startDate: Yup.date().nullable(),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End Date can not be less than Start Date")
    .nullable()
    .test("endDate", "End Date can not be same as Start Date", function (item) {
      let endDate, startDate;
      if (this.parent.endDate) {
        endDate = moment(this.parent.endDate).format("L");
      }
      if (this.parent.startDate) {
        startDate = moment(this.parent.startDate).format("L");
      }

      if (endDate && startDate) {
        let isSame = moment(endDate).isSame(startDate);
        return !isSame;
      }

      return true;
    }),
  skills: Yup.string().typeError("must be text").trim().max(100, "max limit 100"),
});
