import * as Yup from "yup";

const user: any = localStorage.getItem("currentUser");
let currentUser = JSON.parse(user);

export interface HcpItemAddType {
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
  contract_details: {
    rate_per_hour: any;
    signed_on: any;
    salary_credit: any;
  };

  nc_details?: {
    dnr: string;
    shift_type_preference: string;
    location_preference: string;
    more_important_preference: string;
    family_consideration: string;
    zone_assignment: string;
    covid_facility_preference: string;
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
    vaccine: string;
    vaccination_dates?: {
      first_shot: string;
      latest_shot: string;
    };
    is_authorized_to_work?: any;
    is_require_employment_sponsorship?: any;
    travel_preferences?: any[];
  };
}

export const AddHcpInitialValues = {
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
  contract_details: {
    rate_per_hour: "",
    signed_on: null,
    salary_credit: "",
  },

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
    is_vaccinated: "",
    vaccination_dates: {
      first_shot: "",
      latest_shot: "",
    },
    is_authorized_to_work: "",
    is_require_employment_sponsorship: "",
    travel_preferences: [],
  },
};

export const hcpFormValidation = Yup.object({
  first_name: Yup.string()
    .typeError(" must be a text")
    .min(3, "min 3 letters")
    .trim("empty space not allowed")
    .required("required")
    .max(50, "max limit 50")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  last_name: Yup.string()
    .typeError(" must be a text")
    .min(3, "min 3 letters")
    .trim("empty space not allowed")
    .required("required")
    .max(50, "max limit 50")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  email: Yup.string().min(3, "invalid").trim("empty space not allowed").typeError(" must be a text").email("invalid").required("required").max(50, "max limit 50"),
  contact_number: Yup.string().min(12, "min 10 digits").required("required"),
  hcp_type: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
  gender: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
  about: Yup.string().typeError(" must be a text").trim("empty space not allowed"),
  address: Yup.object({
    street: Yup.string().typeError(" must be a text").min(3, "min 3 letters").trim("empty space not allowed").max(150, "max limit 150").required("required"),
    city: Yup.string().typeError(" must be a text").min(2, "min 2 letters").trim("empty space not allowed").max(150, "max limit 150").required("required"),
    state: Yup.string().typeError(" must be a text").min(2, "min 2 letters").trim("empty space not allowed").max(150, "max limit 150").required("required"),
    region: Yup.string().typeError(" must be a text").min(2, "min 2 letters").trim("empty space not allowed").max(150, "max limit 150").required("required"),
    country: Yup.string().typeError(" must be a text").min(2, "min 2 letters").required("required").trim("empty space not allowed").max(150, "max limit 150").required("required"),
    zip_code: Yup.string()
      .typeError(" must be a text")
      .matches(/^[0-9]+$/, "Must be only digits")
      .trim("empty space not allowed")
      .min(5, "min 5 digits")
      .max(6, "max 6 digits allowed")
      .required("required"),
  }),
  professional_details: Yup.object({
    experience: Yup.number().positive(),
    speciality: Yup.string().typeError(" must be a text").min(2, "invalid"),
    summary: Yup.string().typeError(" must be a text").trim("empty space not allowed"),
  }),
  contract_details: Yup.object({
    rate_per_hour: Yup.number().moreThan(0, "must be greater than 0").max(999, "max limit 999").typeError("must be a number"),
    signed_on: Yup.string().typeError("must be date").nullable(),
    salary_credit: Yup.string(),
  }),
  nc_details: Yup.object({
    dnr: Yup.string().min(2, "invalid").trim().typeError("must be valid text").max(30, "max limit 30").nullable(),
    shift_type_preference: Yup.string().trim().typeError("must be valid text").nullable(),
    location_preference: Yup.string().min(2, "invalid").trim().typeError("must be valid text").max(30, "max limit 30").nullable(),
    more_important_preference: Yup.string().trim().typeError("must be valid text").nullable(),
    family_consideration: Yup.string().min(2, "invalid").trim().typeError("must be valid text").max(100, "max limit 100").nullable(),
    zone_assignment: Yup.string().min(2, "invalid").trim().typeError("must be valid text").max(30, "max limit 30").nullable(),
    vaccine: Yup.string().trim().typeError("must be valid text").nullable(),
    covid_facility_preference: Yup.string().trim().typeError("must be valid ").nullable(),
    is_fulltime_job: Yup.string().trim().typeError("must be valid ").nullable(),
    is_supplement_to_income: Yup.string().trim().typeError("must be valid ").nullable(),
    is_studying: Yup.string().trim().typeError("must be valid ").nullable(),
    is_gusto_invited: Yup.string().trim().typeError("must be valid ").nullable(),
    is_gusto_onboarded: Yup.string().trim().typeError("must be valid ").nullable(),
    gusto_type: Yup.string().trim().typeError("must be valid text").nullable(),
    nc_last_updated: Yup.string().trim().typeError("must be valid text").nullable(),
    last_call_date: Yup.string().typeError("must be date").nullable().nullable(),
    contact_type: Yup.string().trim().typeError("must be valid text").nullable(),
    other_information: Yup.string().min(2, "invalid").trim().typeError("must be valid text").max(200, "max limit 200").nullable(),
    vaccination_dates: Yup.object({
      first_shot: Yup.string()
        .trim()
        .typeError("must be valid")
        .matches(/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/, "MM-DD-YYYY format"),
      latest_shot: Yup.string()
        .trim()
        .typeError("must be valid")
        .matches(/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/, "MM-DD-YYYY format"),
    }),
    travel_preferences: Yup.array(),
  }),
});
