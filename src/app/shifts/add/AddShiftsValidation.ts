import * as Yup from "yup";

export const addShiftsValidation = Yup.object({
  title: Yup.string().min(6, "min 6 characters").trim("empty space not allowed").required("required"),
  shift_dates: Yup.array().required("required"),
  mode: Yup.string().required("required"),
  shift_type: Yup.string().required("required"),
  hcp_type: Yup.string().required("required"),
  warning_type: Yup.string().required("required"),
  hcp_count: Yup.number().typeError("must be a number").min(1, "min limit 1.").max(25, "max limit 25.").required("required"),
  shift_details: Yup.string().trim("empty space not allowed").max(750, "max limit 750").required("required"),
});
