import * as Yup from "yup";


const user: any = localStorage.getItem("currentUser");
let currentUser = JSON.parse(user);

export interface HcpItemAddType{
    first_name: string;
    last_name: string;
    email?: string;
    contact_number: string;
    hcp_type: string;
    gender: string;
    about?: string;
    experience?: string;
    speciality?: string;
    summary?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      region: string;
      country: string;
      zip_code: string;
    };
  
    professional_details?: {
      speciality: string;
      experience: number | string;
      summary: string;
    };
  
    rate_per_hour: any;
    signed_on: any;
    salary_credit_date: any;
  
    nc_details?: {
      dnr: string;
      shift_type_preference: string;
      location_preference: string;
      more_important_preference: string;
      family_consideration: string;
      zone_assignment: string;
      vaccine: string;
      covid_facility_preference: string,
      is_fulltime_job: any;
      is_supplement_to_income: any;
      is_studying: any;
      is_gusto_invited: any;
      is_gusto_onboarded: any;
      gusto_type: any;
      nc_last_updated: any;
      last_call_date: any;
      contact_type: any;
      other_information: any;
    }
}

export const AddHcpInitialValues={
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    hcp_type: "",
    gender: "",
    about: "",
    experience: "",
    speciality: "",
    summary: "",
    address: {
      street: "",
      city: "",
      state: "",
      region: "",
      country: "",
      zip_code: "",
    },

    professional_details: {
      experience: "",
      speciality: "",
      summary: "",
    },

    rate_per_hour: "",
    signed_on: null,
    salary_credit_date: null,

    nc_details: {
      dnr: "",
      shift_type_preference: "",
      location_preference: "",
      more_important_preference: "",
      family_consideration: "",
      zone_assignment: "",
      vaccine: "",
      covid_facility_preference: "",
      is_fulltime_job: "",
      is_supplement_to_income: "",
      is_studying: "",
      is_gusto_invited: "",
      is_gusto_onboarded: "",
      gusto_type: "",
      nc_last_updated: `${currentUser?.first_name} ${currentUser?.last_name}`,
      last_call_date: null,
      contact_type: "",
      other_information: "",
    }
  };


  export const hcpFormValidation = Yup.object({
    first_name: Yup.string().typeError(" must be a text").min(3, "invalid").trim("empty space not allowed").required("required"),
    last_name: Yup.string().typeError(" must be a text").min(3, "invalid").trim("empty space not allowed").required("required"),
    email: Yup.string().min(3, "invalid").trim("empty space not allowed").typeError(" must be a text").email("invalid").required("required"),
    contact_number: Yup.number().typeError(" must be a number").required("required"),
    hcp_type: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
    gender: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
    about: Yup.string().typeError(" must be a text").trim("empty space not allowed"),
    address: Yup.object({
      street: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      city: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      state: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      region: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      country: Yup.string().typeError(" must be a text").min(2, "invalid").required("required").trim("empty space not allowed").required("required"),
      zip_code: Yup.string()
        .typeError(" must be a text")
        .matches(/^[0-9]+$/, "Must be only digits")
        .trim("empty space not allowed")
        .min(5, 'min 5 digits')
        .max(6, 'max 6 digits allowed')
        .required("required"),
    }),
    professional_details: Yup.object({
      experience: Yup.number(),
      speciality: Yup.string().typeError(" must be a text").min(2, "invalid"),
      summary: Yup.string().typeError(" must be a text").trim("empty space not allowed"),
    }),
    rate_per_hour: Yup.number().typeError("must be a number"),
    signed_on: Yup.string().typeError("must be date").nullable(),
    salary_credit_date: Yup.number().nullable().min(1, 'Must be greater than 0')
      .max(31, 'Must be less than or equal to 31'),

    nc_details: Yup.object({
      dnr: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      shift_type_preference: Yup.string().trim().typeError("must be valid text"),
      location_preference: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      more_important_preference: Yup.string().trim().typeError("must be valid text"),
      family_consideration: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      zone_assignment: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      vaccine: Yup.string().trim().typeError("must be valid text"),
      covid_facility_preference: Yup.string().trim().typeError("must be valid "),
      is_fulltime_job: Yup.string().trim().typeError("must be valid "),
      is_supplement_to_income: Yup.string().trim().typeError("must be valid "),
      is_studying: Yup.string().trim().typeError("must be valid "),
      is_gusto_invited: Yup.string().trim().typeError("must be valid "),
      is_gusto_onboarded: Yup.string().trim().typeError("must be valid "),
      gusto_type: Yup.string().trim().typeError("must be valid text"),
      nc_last_updated: Yup.string().trim().typeError("must be valid text"),
      last_call_date: Yup.string().typeError("must be date").nullable(),
      contact_type: Yup.string().trim().typeError("must be valid text"),
      other_information: Yup.string().min(2, "invalid").trim().typeError("must be valid text")
    })

});
