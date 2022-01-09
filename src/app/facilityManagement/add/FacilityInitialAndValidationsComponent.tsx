import * as Yup from "yup";

export interface FacilityItemAddType {
    facility_uid: string;
    facility_name: string;
    facility_short_name: string;
    business_name: string;
    email?: string;
    phone_number?: string;
    extension_number: string;
    website_url?: string;
    about?: string;
    timezone?: string;
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
  
  
    latitude: any;
    longitude: any;
    // coordinates?: any;
  }
  
export const facilityInitialState: FacilityItemAddType = {
    facility_uid: "",
    facility_name: "",
    facility_short_name: "",
    business_name: "",
    email: "",
    phone_number: "",
    extension_number: "",
    website_url: "",
    about: "",
    timezone: "",
    address: {
      street: "",
      city: "",
      state: "",
      region_name: "",
      country: "",
      zip_code: "",
    },
    hourly_base_rates: {
      cna: undefined,
      lvn: undefined,
      rn: undefined,
      care_giver: undefined,
      med_tech: undefined,
      holiday: undefined,
      hazard: undefined,
    },
    diff_rates: {
      pm: undefined,
      noc: undefined,
      weekend: undefined,
    },
    conditional_rates: {
      overtime: {
        hours: undefined,
        rate: undefined,
      },
      rush: {
        hours: undefined,
        rate: undefined,
      },
      cancellation_before: {
        hours: undefined,
        rate: undefined,
      },
      shift_early_completion: {
        hours: undefined,
        rate: undefined,
      },
    },
  
    latitude: undefined,
    longitude: undefined
  
  };
  
  
export const facilityFormValidation = Yup.object({
    facility_uid: Yup.string()
      .typeError(" must be a text")
      .required("required")
      .min(3, "invalid")
      .trim("empty space not allowed")
      .required("required"),
    facility_name: Yup.string()
      .typeError(" must be a text")
      .min(3, "invalid")
      .trim("empty space not allowed")
      .required("required"),
    facility_short_name: Yup.string()
      .typeError(" must be a text")
      .min(3, "invalid")
      .trim("empty space not allowed")
      .required("required"),
    business_name: Yup.string()
      .typeError(" must be a text")
      .min(3, "invalid")
      .trim("empty space not allowed")
      .required("required"),
    email: Yup.string()
      .typeError(" must be a text")
      .email("invalid"),
    phone_number: Yup.string()
      .min(12, "min 10 digits")
      .required("required"),
    extension_number: Yup.number().typeError(" must be a number"),
    website_url: Yup.string()
      .typeError(" must be a text")
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
      ),
    timezone: Yup.number().typeError(" must be a number").required('required'),
    about: Yup.string()
      .typeError(" must be a text")
      .trim("empty space not allowed"),
    address: Yup.object({
      street: Yup.string()
        .typeError(" must be a text")
        .min(2, "invalid")
        .trim("empty space not allowed")
        .required("required"),
      city: Yup.string()
        .typeError(" must be a text")
        .min(2, "invalid")
        .trim("empty space not allowed")
        .required("required"),
      state: Yup.string()
        .typeError(" must be a text")
        .min(2, "invalid")
        .trim("empty space not allowed")
        .required("required"),
      region_name: Yup.string()
        .typeError(" must be a text")
        .min(2, "invalid")
        .trim("empty space not allowed"),
      country: Yup.string()
        .typeError(" must be a text")
        .min(2, "invalid")
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
      cna: Yup.number().typeError(" must be a number").nullable(),
      lvn: Yup.number().typeError(" must be a number").nullable(),
      rn: Yup.number().typeError(" must be a number").nullable(),
      care_giver: Yup.number().typeError(" must be a number").nullable(),
      med_tech: Yup.number().typeError(" must be a number").nullable(),
      holiday: Yup.number().typeError(" must be a number").nullable(),
      hazard: Yup.number().typeError(" must be a number").nullable(),
    }),
    diff_rates: Yup.object({
      pm: Yup.number().typeError(" must be a number").nullable(),
      noc: Yup.number().typeError(" must be a number").nullable(),
      weekend: Yup.number().typeError(" must be a number").nullable(),
    }),
    conditional_rates: Yup.object({
      overtime: Yup.object({
        hours: Yup.number().typeError(" must be a number").nullable(),
        rate: Yup.number().typeError(" must be a number").nullable(),
      }),
      rush: Yup.object({
        hours: Yup.number().typeError(" must be a number").nullable(),
        rate: Yup.number().typeError(" must be a number").nullable(),
      }),
      cancellation_before: Yup.object({
        hours: Yup.number().typeError(" must be a number").nullable(),
        rate: Yup.number().typeError(" must be a number").nullable(),
      }),
      shift_early_completion: Yup.object({
        hours: Yup.number().typeError(" must be a number").nullable(),
        rate: Yup.number().typeError(" must be a number").nullable(),
      }),
    }),
  
  
    longitude: Yup.number().typeError("must be a number").required("required"),
    latitude: Yup.number().typeError("must be a number").required("required"),
  });
  