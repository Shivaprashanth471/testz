import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, CircularProgress, MenuItem, Typography } from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, FieldProps } from "formik";
import { Link, useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { americanTimeZone, otHours } from "../../../constants/data";
import { ApiService, CommonService, Communications } from "../../../helpers";
import FacilityAddComponent from "./FacilityMemberEditComponent/FacilityMemberEditComponent";
import { TextField } from "formik-material-ui";
import "./FacilityManagementEditScreen.scss";
import ShiftAddComponent from "./ShiftEditComponent/ShiftEditComponent";
import { ENV } from "../../../constants";
import PhoneInputComponent from "../../../components/phoneInput/PhoneInputComponent";
import 'react-phone-number-input/style.css';
import FileDropZoneComponent from "../../../components/core/FileDropZoneComponent";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import { pdfIcon } from "../../../constants/ImageConfig";
import ScrollToTop from "react-scroll-to-top";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import DialogComponent from "../../../components/DialogComponent";
import { ScrollToError } from "../../hcpManagement/add/ScrollToError";

interface FacilityItemAddType {
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

const facilityFormValidation = Yup.object({
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

  location: Yup.object({
    coordinates: Yup.object({
      longitude: Yup.number().typeError("must be a number").required("required"),
      latitude: Yup.number().typeError("must be a number").required("required"),
    })
  })
});

const FacilityManagementEditScreen = () => {
  const history = useHistory();
  const [timezone, setTimeZone] = useState(0)
  const [members, setMembers] = useState<any[]>([]);
  const [shiftTimings, setShiftTimings] = useState<any[]>([]);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [facilityDetails, setFacilityDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [regions, setRegions] = useState<any>([]);
  const [regIsLoading, setRegIsLoading] = useState<boolean>(true);
  const [facilitySubmitting, setIsFacilitySubmitting] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState<boolean>(false);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false)

  const facilityInitialState: FacilityItemAddType = {
    facility_uid: facilityDetails?.facility_uid,
    facility_name: facilityDetails?.facility_name,
    facility_short_name: facilityDetails?.facility_short_name,
    business_name: facilityDetails?.business_name,
    email: facilityDetails?.email,
    phone_number: facilityDetails?.phone_number,
    extension_number: facilityDetails?.extension_number,
    website_url: facilityDetails?.website_url,
    about: facilityDetails?.about,
    address: {
      street: facilityDetails?.address?.street,
      city: facilityDetails?.address?.city,
      state: facilityDetails?.address?.state,
      region_name: facilityDetails?.address?.region_name,
      country: facilityDetails?.address?.country,
      zip_code: facilityDetails?.address?.zip_code,
    },
    timezone: facilityDetails?.timezone,
    hourly_base_rates: {
      cna: facilityDetails?.hourly_base_rates?.cna,
      lvn: facilityDetails?.hourly_base_rates?.lvn,
      rn: facilityDetails?.hourly_base_rates?.rn,
      care_giver: facilityDetails?.hourly_base_rates?.care_giver,
      med_tech: facilityDetails?.hourly_base_rates?.med_tech,
      holiday: facilityDetails?.hourly_base_rates?.holiday,
      hazard: facilityDetails?.hourly_base_rates?.hazard,
    },
    diff_rates: {
      pm: facilityDetails?.diff_rates?.pm,
      noc: facilityDetails?.diff_rates?.noc,
      weekend: facilityDetails?.diff_rates?.weekend,
    },
    conditional_rates: {
      overtime: {
        hours: facilityDetails?.conditional_rates?.overtime?.hours,
        rate: facilityDetails?.conditional_rates?.overtime?.rate,
      },
      rush: {
        hours: facilityDetails?.conditional_rates?.rush?.hours,
        rate: facilityDetails?.conditional_rates?.rush?.rate,
      },
      cancellation_before: {
        hours: facilityDetails?.conditional_rates?.cancellation_before?.hours,
        rate: facilityDetails?.conditional_rates?.cancellation_before?.rate,
      },
      shift_early_completion: {
        hours:
          facilityDetails?.conditional_rates?.shift_early_completion?.hours,
        rate: facilityDetails?.conditional_rates?.shift_early_completion?.rate,
      },
    },

    location: {
      coordinates: {
        longitude: facilityDetails?.location?.coordinates?.[0],
        latitude: facilityDetails?.location?.coordinates?.[1],
      }
    }
  };

  const handleFacilityImageUpload = useCallback(async (link: any) => {
    const file = fileUpload?.wrapper[0]?.file;
    delete file.base64;
    CommonService._api.upload(link, file, { "Content-Type": file?.type }).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }, [fileUpload?.wrapper])

  const handlegetUrlForUpload = useCallback(() => {
    let payload = {
      "file_name": fileUpload?.wrapper[0]?.file?.name,
      "file_type": fileUpload?.wrapper[0]?.file?.type,
    }
    CommonService._api.post(ENV.API_URL + 'facility/' + id + '/profile', payload).then((resp) => {
      handleFacilityImageUpload(resp?.data)
    }).catch((err) => {
      console.log(err)
      CommonService.showToast(err || "Error", "error");
    })
  }, [handleFacilityImageUpload, fileUpload?.wrapper, id])

  const init = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "facility/" + id).then((resp) => {
      setFacilityDetails(resp.data);
      setTimeZone(resp?.data?.timezone)
      setIsLoading(false);
    })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const deleteFacilityImage = useCallback(() => {
    setIsImageRemoved(true)
    CommonService._api.delete(ENV.API_URL + "facility/" + id + "/profile").then((resp) => {
      init();
    })
      .catch((err) => {
        console.log(err);
      });
  }, [init, id])

  const getRegions = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
      setRegions(resp.data || []);
      setRegIsLoading(false);
    })
      .catch((err) => {
        console.log(err);
        setRegIsLoading(false);
      });
  }, []);

  const getShiftDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "facility/" + id + "/shift").then((resp) => {
      setShiftTimings(resp.data || []);
    })
      .catch((err) => {
        console.log(err);
        setShiftTimings([]);
      });
  }, [id]);

  const getFacilityMembers = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "facility/" + id + "/member").then((resp) => {
      setMembers(resp.data || []);
    })
      .catch((err) => {
        console.log(err);
        setMembers([]);
      });
  }, [id]);

  useEffect(() => {
    init();
    getFacilityMembers();
    getShiftDetails();
    getRegions()
  }, [init, getFacilityMembers, getShiftDetails, getRegions]);

  useEffect(() => {
    // console.log(shiftTimings, 'shiftTimings');
  }, [shiftTimings]);

  const deleteFile = (temp: any) => {
    let data = fileUpload?.wrapper.filter((_: any, index: any) => index !== temp);
    setFileUpload(prevState => {
      return { wrapper: [...data] };
    })
  }


  const onAddShift = useCallback((shift: any, facilityId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "facility/" + id + "/shift", shift)
        .then((resp: any) => {
          console.log(resp);
          if (resp && resp.success) {
            CommonService.showToast('Facility Shift Timing added', 'info')
            resolve(null);
          } else {
            reject(resp);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, [id]);

  const onAddMember = useCallback((member: any) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "facility/" + id + "/member", member)
        .then((resp: any) => {
          console.log(resp);
          if (resp && resp.success) {
            CommonService.showToast(resp?.msg || 'Facility Member added', 'info')
            resolve(null);
          } else {
            reject(resp);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, [id]);

  const onAdd = (facility: FacilityItemAddType, { setSubmitting, setErrors, resetForm }: FormikHelpers<FacilityItemAddType>) => {
    setIsFacilitySubmitting(true)
    let regionName = regions.find((item: any) => item.name === facility?.address?.region_name)
    facility.coordinates = [Number(facility?.location?.coordinates?.longitude), Number(facility?.location?.coordinates?.latitude)]
    let payload = {
      ...facility,
      address: {
        ...facility.address, region_name: regionName.code
      }
    }

    if (isImageRemoved && fileUpload?.wrapper?.length > 0) {
      handlegetUrlForUpload()
    } else if (fileUpload?.wrapper?.length > 0) {
      handlegetUrlForUpload()
    }

    ApiService.put(ENV.API_URL + "facility/" + id, payload).then((resp: any) => {
      console.log(resp);
      if (resp && resp.success) {
        CommonService.showToast(resp.msg || "Success", "success");
        history.push("/facility/view/" + id);
      } else {
        setSubmitting(false);
        setIsFacilitySubmitting(false)
      }
    })
      .catch((err) => {
        console.log(err)
        CommonService.handleErrors(setErrors, err);
        setSubmitting(false);
        setIsFacilitySubmitting(false)
        CommonService.showToast(err.msg || "Error", "error");
      });
  };

  const previewFile = useCallback((index: any) => {
    setPreviewFile(fileUpload?.wrapper[index])
    setOpen(true)
  }, [fileUpload])

  const cancelPreviewFile = useCallback(() => {
    setOpen(false)
  }, [])
  const confirmPreviewFile = useCallback(() => {
    setOpen(false)
  }, [])


  useEffect(() => {
    Communications.pageTitleSubject.next("Edit Facility");
    Communications.pageBackButtonSubject.next("/facility/list");
  }, []);

  const onFileSelected = (files: File[]) => {
    for (let file of files) {
      // console.log(file)
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: 'Data',
        uploadUrl: ENV.API_URL + 'facility/add',
        allowed_types: ['jpg', 'png', 'csv', 'pdf', 'jpeg'],
        extraPayload: { expiry_date: '' }
      };
      const uploadWrapper = new TsFileUploadWrapperClass(uploadConfig, CommonService._api, (state: { wrapper: TsFileUploadWrapperClass }) => {
        // console.log(state);
        setFileUpload((prevState) => {
          if (prevState) {
            const index = prevState?.wrapper.findIndex((value: any) => value.uploadId === state.wrapper.uploadId);
            prevState.wrapper[index] = state.wrapper;
            return { wrapper: prevState.wrapper };
          }
          return prevState;
        })
      });
      uploadWrapper.onError = (err, heading) => {
        // console.error(err, heading);
        if (heading) {
          CommonService.showToast(err, 'error');
        }
      };
      uploadWrapper.onSuccess = (resp) => {
        console.log(resp, "contract");
        if (resp && resp.success) {
          CommonService.showToast(resp.msg || resp.error, 'success');
        }
      };
      uploadWrapper.onProgress = (progress) => {
        // console.log('progress', progress);
      };
      setFileUpload(prevState => {
        let state: TsFileUploadWrapperClass[] = [];
        if (prevState) {
          state = prevState?.wrapper;
        }
        const newState = [...state, uploadWrapper];
        return { wrapper: newState };
      });
      // uploadWrapper.startUpload();
    }
    setTimeout(() => setIsImage(!isImage), 1000)
  }

  useEffect(() => {


  }, [isImage])


  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }



  if (isLoading || regIsLoading) {
    return <div className="facility-main  screen">
      <div className="view-loading-indicator">
        <CircularProgress color="secondary" className="loader" />
      </div>
    </div>
  }

  return !isLoading && !regIsLoading ? (
    <div className="facility-main  screen">
      <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
        <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
      </DialogComponent>
      <Formik initialValues={facilityInitialState} validateOnChange={true} validationSchema={facilityFormValidation} onSubmit={onAdd}>
        {({ isSubmitting, isValid, resetForm }) => (
          <Form id="facility-edit-form" className={"form-holder"}>
            <ScrollToError />
            <div className="facility-basic-details mrg-top-40 custom-border">
              <p className='card-header'>Basic Details</p>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="facility_name"
                  type={"text"}
                  component={TextField}
                  label="Facility Name*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_facility_name'
                />
                <Field
                  variant="outlined"
                  name="business_name"
                  type={"text"}
                  component={TextField}
                  label="Business Name*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_business_name'

                />
              </div>

              <div className="input-container">
                <Field
                  variant="outlined"
                  name="facility_uid"
                  type={"text"}
                  component={TextField}
                  label="Facility Unique ID*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_facility_uid'

                />
                <Field
                  variant="outlined"
                  name="facility_short_name"
                  type={"text"}
                  component={TextField}
                  label="Facility Short Name*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_facility_short_name'

                />
              </div>
              <div className="input-container mrg-top-10">
                <Field
                  SelectProps={showDropDownBelowField}
                  variant="outlined"
                  name="address.region_name"
                  type={"text"}
                  component={TextField}
                  select
                  label="Region"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_address_region_name'
                  className="flex-1"
                >
                  {regions &&
                    regions.map((item: any, index: any) => (
                      <MenuItem value={item.name} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Field>
                <div className="flex-1 d-flex">
                  <div className="phone-number">
                    <Field name={'phone_number'} className="flex-1">
                      {(field: FieldProps) => {
                        return <PhoneInputComponent field={field} placeholder={'Enter Phone number*'} />
                      }}
                    </Field>
                  </div>
                  <div className="extension-number" >
                    <Field
                      variant='outlined'
                      component={TextField}
                      fullWidth
                      autoComplete="off"
                      label="Extension No."
                      name="extension_number"
                      id="input_facility_add_extension_number"
                    />
                  </div>
                </div>
              </div>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="email"
                  type={"text"}
                  component={TextField}
                  label="Email"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_email'

                />
                <Field
                  variant="outlined"
                  name="website_url"
                  type={"text"}
                  component={TextField}
                  label="Website"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_website_url'

                />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  variant="outlined"
                  name="address.street"
                  type={"text"}
                  component={TextField}
                  label="Street*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_address_street'

                />
                <Field
                  variant="outlined"
                  name="address.city"
                  type={"text"}
                  component={TextField}
                  label="City*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_address_city'
                />
              </div>

              <div className="input-container">
                <Field
                  variant="outlined"
                  name="address.state"
                  type={"text"}
                  component={TextField}
                  label="State*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_address_state'
                />
                <Field
                  variant="outlined"
                  name="address.country"
                  type={"text"}
                  component={TextField}
                  label="Country*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_address_country'
                />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  inputProps={{
                    maxLength: 6
                  }}
                  variant="outlined"
                  name="address.zip_code"
                  type={"text"}
                  component={TextField}
                  label="Zip Code*"
                  autoComplete="off"
                  id='input_facility_edit_address_zip_code'
                />
                <Field
                  fontSize='small'
                  className="timezone-select"
                  variant="outlined"
                  name="timezone"
                  type={"text"}
                  component={TextField}
                  select
                  SelectProps={showDropDownBelowField}
                  label="Facility Timezone*"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_timezone'
                >
                  <MenuItem style={{ fontWeight: 500 }} value=""> Select Timezone</MenuItem>
                  {americanTimeZone &&
                    americanTimeZone.map((item: any, index: any) => (
                      <MenuItem style={{ fontSize: '14px' }} value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Field>
              </div>

              <div className="input-container">
                <Field
                  fullWidth
                  variant="outlined"
                  name="location.coordinates.latitude"
                  type={"text"}
                  component={TextField}
                  label="Latitude*"
                  autoComplete="off"
                  id='input_facility_add_latitude'
                />
                <Field
                  fullWidth
                  variant="outlined"
                  name="location.coordinates.longitude"
                  type={"text"}
                  component={TextField}
                  label="Longitude*"
                  autoComplete="off"
                  id='input_facility_add_longitude'
                />
              </div>
              <div className="facility-about mrg-top-10">
                <Typography color="textPrimary">About the Facility</Typography>
                <Field
                  variant="outlined"
                  component={TextField}
                  type={"text"}
                  name="about"
                  fullWidth
                  multiline
                  rows={2}
                  id='input_facility_edit_about'
                />
              </div>
            </div>
            <div className="facility-other-details mrg-top-10  custom-border">
              <p className='card-header'>Other Details</p>
              <div className="input-container ">
                <Field
                  variant="outlined"
                  name="hourly_base_rates.cna"
                  type={"text"}
                  component={TextField}
                  label="CNA Rate ($/hr)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_cna'
                />
                <Field
                  variant="outlined"
                  name="hourly_base_rates.lvn"
                  type={"text"}
                  component={TextField}
                  label="LVN Rate ($/hr)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_lvn'
                />
              </div>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="hourly_base_rates.rn"
                  type={"text"}
                  component={TextField}
                  label="RN Rate ($/hr)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_rn'
                />
                <Field
                  variant="outlined"
                  name="hourly_base_rates.care_giver"
                  type={"text"}
                  component={TextField}
                  label="Care Giver (hr)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_care_giver'
                />
              </div>
              <div className="input-container ">
                <Field
                  variant="outlined"
                  name="hourly_base_rates.med_tech"
                  type={"text"}
                  component={TextField}
                  label="Med Tech (hr)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_med_tech'
                />
                <Field
                  variant="outlined"
                  name="hourly_base_rates.holiday"
                  type={"text"}
                  component={TextField}
                  label="Holiday Rate ($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_holiday'
                />
              </div>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="diff_rates.noc"
                  type={"text"}
                  component={TextField}
                  label="NOC Diff ($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_diff_rates_noc'
                />
                <Field
                  variant="outlined"
                  name="hourly_base_rates.hazard"
                  type={"text"}
                  component={TextField}
                  label="Hazard Rate ($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_hourly_base_rates_hazard'
                />
              </div>
              <div className="input-container ">
                <Field
                  variant="outlined"
                  name="diff_rates.pm"
                  type={"text"}
                  component={TextField}
                  label="PM Diff ($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_diff_rates_pm'
                />
                <Field
                  variant="outlined"
                  name="diff_rates.weekend"
                  type={"text"}
                  component={TextField}
                  label="Weekend Rate ($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_diff_rates_weekend'
                />
              </div>
              <div className="input-container">
                <Field
                  SelectProps={showDropDownBelowField}
                  variant="outlined"
                  name="conditional_rates.overtime.hours"
                  type={"text"}
                  component={TextField}
                  select
                  label="OT Hours (hr/day)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates.overtime.hours'
                >
                  <MenuItem>Select</MenuItem>
                  {otHours &&
                    otHours.map((item: any, index) => (
                      <MenuItem value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Field>
                <Field
                  variant="outlined"
                  name="conditional_rates.overtime.rate"
                  type={"text"}
                  component={TextField}
                  label="OT Rate($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_overtime_rate'

                />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  variant="outlined"
                  name="conditional_rates.rush.hours"
                  type={"text"}
                  component={TextField}
                  label="Rush Hours"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_rush_hours'

                />
                <Field
                  variant="outlined"
                  name="conditional_rates.rush.rate"
                  type={"text"}
                  component={TextField}
                  label="Rush Rate($)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_rush_rate'
                />
              </div>
              <div className="input-container">
                <Field
                  variant="outlined"
                  name="conditional_rates.cancellation_before.hours"
                  type={"text"}
                  component={TextField}
                  label="Cancellation Before Hours"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_cancellation_before_hours'

                />
                <Field
                  variant="outlined"
                  name="conditional_rates.cancellation_before.rate"
                  type={"text"}
                  component={TextField}
                  label="Cancellation Before Rate(Hrs)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_cancellation_before_rate'

                />
              </div>

              <div className="input-container mrg-top-10">
                <Field
                  variant="outlined"
                  name="conditional_rates.shift_early_completion.hours"
                  type={"text"}
                  component={TextField}
                  label="Shift Early Completion Hours"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_shift_early_completion_hours'

                />
                <Field
                  variant="outlined"
                  name="conditional_rates.shift_early_completion.rate"
                  type={"text"}
                  component={TextField}
                  label="Shift Early Completion Rate(Hrs)"
                  fullWidth
                  autoComplete="off"
                  id='input_facility_edit_conditional_rates_shift_early_completion_rate'

                />
              </div>
              <p className='card-header facility-image-header'>Facility Image</p>
              {facilityDetails?.image_url && !isImageRemoved ? <div className="attachments">
                <div className="custom_file">
                  <div className="d-flex">
                    <div className="mrg-left-0 mrg-top-10"><img src={facilityDetails?.image_url} alt="" style={{ height: "100px", width: "100px" }} /> </div>
                    <div className="file_details mrg-left-20">
                    </div>
                  </div>
                  <div className="facility_image_actions mrg-left-5 mrg-top-10 ">
                    <p style={{ cursor: "pointer", width: '50px' }} onClick={deleteFacilityImage}>Delete</p>
                  </div>
                </div>
              </div> : <>
                {fileUpload?.wrapper.length > 0 ? fileUpload?.wrapper?.map((item: any, index: any) => {
                  return (
                    <div className="attachments">
                      <div className="custom_file">
                        <div className="d-flex">
                          <div className="mrg-left-0 mrg-top-10">{item?.file?.type === "image/jpg" || item?.file?.type === "image/png" || item?.file?.type === "image/jpeg" ? <img src={item?.file?.base64} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} /> : <img src={pdfIcon} alt="" style={{ height: "100px", width: "100px" }} onClick={() => previewFile(index)} />}</div>
                          <div className="file_details mrg-left-20">
                          </div>
                        </div>
                        <div className="d-flex image_actions mrg-top-10">
                          <p style={{ cursor: 'pointer' }} onClick={() => previewFile(index)} className="delete-image">View</p>
                          <p style={{ cursor: 'pointer' }} onClick={() => deleteFile(index)} className="delete-image mrg-left-20">Delete</p>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <Box display="flex" gridGap="10px">
                    <Box width="250px" className="mrg-top-10">
                      <FileDropZoneComponent allowedTypes={".jpg,.png,jpeg"}
                        OnFileSelected={onFileSelected}
                      />
                    </Box>
                  </Box>
                )}</>}</div>
          </Form>
        )}
      </Formik>

      <div className="facility-members mrg-top-10  custom-border">
        <p className='card-header'>Facility Members</p>
        <div className="facility-add-component-container">
          <FacilityAddComponent
            onAddMember={onAddMember}
            hcpId={id}
            members={members}
            setMembers={setMembers}
            getFacilityMembers={getFacilityMembers}
          />
        </div>
      </div>

      <div className="facility-shift-timings mrg-top-10  custom-border">
        <p className='card-header'>Shift Timings</p>

        <ShiftAddComponent
          timezone={timezone}
          onAddShift={onAddShift}
          facilityId={id}
          getShiftDetails={getShiftDetails}
          setShiftTimings={setShiftTimings}
          shiftTimings={shiftTimings}
        />
      </div>

      <div className="facility-actions mrg-top-60">
        <Button
          size="large"
          variant={"outlined"}
          className={"normal"}
          component={Link}
          color="primary"
          to={`/facility/view/${id}`}
        >
          Cancel
        </Button>
        <Button
          disabled={facilitySubmitting}
          form="facility-edit-form"
          type="submit"
          size="large"
          variant={"contained"}
          className="pdd-left-30 pdd-right-30"
          color={"primary"}
        >
          Save
        </Button>
      </div>
      <ScrollToTop smooth color="white" />
    </div>
  ) : (
    <></>
  );
};

export default FacilityManagementEditScreen;
