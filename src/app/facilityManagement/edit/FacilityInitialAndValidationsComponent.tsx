import * as Yup from "yup";

export interface FacilityItemEditType {
  facility_uid: string;
  facility_name: string;
  facility_short_name: string;
  business_name: string;
  email?: string;
  phone_number?: string;
  extension_number: string;
  website_url?: string;
  timezone?: string;
  about?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    region_name: string;
    country: string;
    zip_code: string;
  };
  hourly_base_rates?: {
    cna?: number;
    lvn?: number;
    rn?: number;
    care_giver?: number;
    med_tech?: number;
    holiday?: number;
    hazard?: number;
  };
  diff_rates?: {
    pm?: number;
    noc?: number;
    weekend?: number;
  };
  conditional_rates: {
    overtime?: {
      hours?: number;
      rate?: number;
    };
    rush?: {
      hours?: number;
      rate?: number;
    };
    cancellation_before?: {
      hours?: number;
      rate?: number;
    };
    shift_early_completion?: {
      hours?: number;
      rate?: number;
    };
  };

  location: any;
  coordinates?: any
}

export const facilityFormEditValidation = Yup.object({
  facility_uid: Yup.string()
    .typeError(" must be a text")
    .required("required")
    .min(3, "min 3 letters")
    .trim("empty space not allowed")
    .required("required"),
  facility_name: Yup.string()
    .typeError(" must be a text")
    .min(3, "min 3 letters")
    .max(255, "max limit 255")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .trim("empty space not allowed")
    .required("required"),
  facility_short_name: Yup.string()
    .typeError(" must be a text")
    .min(3, "min 3 letters")
    .max(30, "max limit 30")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .trim("empty space not allowed")
    .required("required"),
  business_name: Yup.string()
    .typeError(" must be a text")
    .min(3, "min 3 letters")
    .max(255, "max limit 255")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .trim("empty space not allowed"),
  email: Yup.string()
    .typeError(" must be a text")
    .email("invalid").max(50, 'max limit 50'),
  phone_number: Yup.string()
    .min(12, "min 10 digits")
    .required("required"),
  extension_number: Yup.string()
    .matches(/^[0-9]+$/, "must be number")
    .trim("empty space not allowed")
    .min(1, 'min 1 digit')
    .max(10, 'max 10 digits'),
  website_url: Yup.string()
    .typeError(" must be a text")
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    ).max(30, 'max limit 30'),
  timezone: Yup.number().typeError(" must be a number").required('required'),
  about: Yup.string()
    .typeError(" must be a text")
    .max(750, "max limit 750")
    .trim("empty space not allowed"),
  address: Yup.object({
    street: Yup.string()
      .typeError(" must be a text")
      .min(2, "min 2 letters")
      .max(30, 'max limit 30')
      .trim("empty space not allowed")
      .required("required"),
    city: Yup.string()
      .typeError(" must be a text")
      .min(2, "min 2 letters")
      .max(30, 'max limit 30')
      .trim("empty space not allowed")
      .required("required"),
    state: Yup.string()
      .typeError(" must be a text")
      .min(2, "min 2 letters")
      .max(30, 'max limit 30')
      .trim("empty space not allowed")
      .required("required"),
    region_name: Yup.string()
      .typeError(" must be a text")
      .min(2, "min 2 letters")
      .max(30, 'max limit 30')
      .trim("empty space not allowed").required("required"),
    country: Yup.string()
      .typeError(" must be a text")
      .min(2, "min 2 letters")
      .max(30, 'max limit 30')
      .trim("empty space not allowed")
      .required("required"),
    zip_code: Yup.string()
      .typeError(" must be a text")
      .matches(/^[0-9]+$/, "Must be only digits")
      .trim("empty space not allowed")
      .min(5, 'min 5 digits')
      .max(6, 'max 6 digits allowed')
      .required("required"),
  }),
  hourly_base_rates: Yup.object({
    cna: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required").nullable(),
    lvn: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required").nullable(),
    rn: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required").nullable(),
    care_giver: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required").nullable(),
    med_tech: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required").nullable(),
    holiday: Yup.number().typeError(" must be a number").nullable(),
    hazard: Yup.number().typeError(" must be a number").nullable(),
  }),
  diff_rates: Yup.object({
    pm: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required"),
    noc: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required"),
    weekend: Yup.string()
      .typeError(" must be valid")
      .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
      .trim("empty space not allowed")
      .max(10, 'max 10 digits allowed')
      .required("required"),
  }),
  conditional_rates: Yup.object({
    overtime: Yup.object({
      hours: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
      rate: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
    }),
    rush: Yup.object({
      hours: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
      rate: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
    }),
    cancellation_before: Yup.object({
      hours: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
      rate: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
    }),
    shift_early_completion: Yup.object({
      hours: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
      rate: Yup.string()
        .typeError(" must be valid")
        .matches(/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/, "invalid")
        .trim("empty space not allowed")
        .max(10, 'max 10 digits allowed').nullable(),
    }),
  }),

  location: Yup.object({
    coordinates: Yup.object({
      longitude: Yup.number().typeError("must be a number").required("required"),
      latitude: Yup.number().typeError("must be a number").required("required"),
    })
  })
});