import { Box, Button, CircularProgress, MenuItem } from "@material-ui/core";
import NormalTextField from '@material-ui/core/TextField';
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker, DateTimePicker } from "formik-material-ui-pickers";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import 'react-phone-number-input/style.css';
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import FileDropZoneComponent from "../../../components/core/FileDropZoneComponent";
import PhoneInputComponent from "../../../components/phoneInput/PhoneInputComponent";
import { ENV } from "../../../constants";
import { boolAcknowledge, contactType, covidPreference, genderTypes, gustoType, moreImportant, shiftTypePreference, vaccine } from "../../../constants/data";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { ApiService, CommonService, Communications } from "../../../helpers";
import "./EditHcpComponent.scss";
import EducationAddComponent from "./EducationEditComponent/EducationEditComponent";
import ExperienceEditComponent from "./ExperienceEditComponent/ExperienceEditComponent";
import ReferenceAddComponent from "./ReferenceEditComponent/ReferenceEditComponent";
import VolunteerExperienceEditComponent from "./VolunteerExperienceEditComponent/VolunteerExperienceEditComponent";
import ScrollToTop from "react-scroll-to-top";
import DialogComponent from "../../../components/DialogComponent";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import { ScrollToError } from "../add/ScrollToError";

interface HcpItemAddType {
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

  rate_per_hour: any,
  signed_on: any,
  salary_credit_date: any,

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

const EditHcpComponent = () => {
  const user: any = localStorage.getItem("currentUser");
  let currentUser = JSON.parse(user);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [hcpDetails, setHcpDetails] = useState<any | null>(null);
  const [hcpTypesLoading, setHcpTypesLoading] = useState<boolean>(true);
  const [educations, setEducations] = useState<any>([]);
  const [experiences, setExperiences] = useState<any>([]);
  const [references, setReferences] = useState<any>([]);
  const [volunteerExperiences, setVolunteerExperiences] = useState<any>([]);
  const [regions, setRegions] = useState<any>([]);
  const [specialitiesMaster, setSpecialitiesMaster] = useState<any>([]);
  const [hcpTypeSpecialities, setHcpTypeSpecialities] = useState<any>([]);
  const [hcpTypes, setHcpTypes] = useState<any>([])
  const [attachmentsDetails, setAttachmentsDetails] = useState<any | null>(null)
  const [contractDetails, setContractDetails] = useState<any>(null)
  const [contractFile, setContractFile] = useState<{ wrapper: any } | null>(null);
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [specIsLoading, setSpecIsLoading] = useState<boolean>(true);
  const [regIsLoading, setRegIsLoading] = useState<boolean>(true);
  const [isAttachmentsLoading, setIsAttachmentsLoading] = useState<boolean>(true);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isContractDeleted, SetIsContractDeleted] = useState<boolean>(false);


  const [required_attachments, setRequiredAttachments] = useState<any>([
    { attachment_type: "Physical Test", index: -1, id: 1 },
    { attachment_type: "TB Test", index: -1, id: 2 },
    { attachment_type: "Chest X-ray", index: -1, id: 3 },
    { attachment_type: "CPR/BLS Card", index: -1, id: 4 },
    { attachment_type: "Driver's Licence", index: -1, id: 5 },
    { attachment_type: "SSN Card", index: -1, id: 6 },
    { attachment_type: "License", index: -1, id: 7 },
    { attachment_type: "Covid Certificate", index: -1, id: 8 },
    { attachment_type: "Covid Vaccine Card", index: -1, id: 9 },
    { attachment_type: "Covid Test Result", index: -1, id: 10 },
    { attachment_type: "Livescan", index: -1, id: 11 },
    { attachment_type: "Vaccine Exemption Letter", index: -1, id: 12 }
  ])

  const [isHcpSubmitting, setIsHcpSubmitting] = useState<boolean>(false);
  const [expInYears, setExpInYears] = useState<number>(0)
  const [specialities, setSpecialities] = useState<string>('');
  const [calcExperience, setCalcExperience] = useState<any>([])


  const handleHcpTypeChange = useCallback((hcp_type: string) => {
    const selectedSpeciality = specialitiesMaster[hcp_type];
    setHcpTypeSpecialities(selectedSpeciality);
  }, [specialitiesMaster]);


  let hcpInitialState: HcpItemAddType = {
    first_name: hcpDetails?.first_name,
    last_name: hcpDetails?.last_name,
    email: hcpDetails?.email,
    contact_number: (hcpDetails?.contact_number),
    hcp_type: hcpDetails?.hcp_type,
    gender: hcpDetails?.gender,
    about: hcpDetails?.about,
    experience: hcpDetails?.professional_details?.experience,
    summary: hcpDetails?.professional_details?.summary,
    address: {
      street: hcpDetails?.address?.street,
      city: hcpDetails?.address?.city,
      state: hcpDetails?.address?.state,
      region: hcpDetails?.address?.region,
      country: hcpDetails?.address?.country,
      zip_code: hcpDetails?.address?.zip_code,
    },

    professional_details: {
      experience: "",
      speciality: "",
      summary: hcpDetails?.professional_details?.summary,
    },

    rate_per_hour: '',
    signed_on: null,
    salary_credit_date: null,

    nc_details: {
      dnr: hcpDetails?.nc_details?.dnr,
      shift_type_preference: hcpDetails?.nc_details?.shift_type_preference,
      location_preference: hcpDetails?.nc_details?.location_preference,
      more_important_preference: hcpDetails?.nc_details?.more_important_preference,
      family_consideration: hcpDetails?.nc_details?.family_consideration,
      zone_assignment: hcpDetails?.nc_details?.zone_assignment,
      vaccine: hcpDetails?.nc_details?.vaccine,
      covid_facility_preference: hcpDetails?.nc_details?.covid_facility_preference,
      is_fulltime_job: hcpDetails?.nc_details?.is_fulltime_job,
      is_supplement_to_income: hcpDetails?.nc_details?.is_supplement_to_income,
      is_studying: hcpDetails?.nc_details?.is_studying,
      is_gusto_invited: hcpDetails?.nc_details?.is_gusto_invited,
      is_gusto_onboarded: hcpDetails?.nc_details?.is_gusto_onboarded,
      gusto_type: hcpDetails?.nc_details?.gusto_type,
      nc_last_updated: hcpDetails?.nc_details?.nc_last_updated ? hcpDetails?.nc_details?.nc_last_updated : `${currentUser?.first_name} ${currentUser?.last_name}`,
      last_call_date: hcpDetails?.nc_details?.last_call_date,
      contact_type: hcpDetails?.nc_details?.contact_type,
      other_information: hcpDetails?.nc_details?.other_information,
    }
  };

  const hcpFormValidation = Yup.object({
    first_name: Yup.string().typeError(" must be a text").min(3, "invalid").trim("empty space not allowed").required("required"),
    last_name: Yup.string().typeError(" must be a text").min(3, "invalid").trim("empty space not allowed").required("required"),
    email: Yup.string().typeError(" must be a text").email("invalid").trim("empty space not allowed").required("required"),
    contact_number: Yup.number().typeError("must be a number").required(),
    hcp_type: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
    gender: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
    about: Yup.string().typeError(" must be a text").trim("empty space not allowed"),
    address: Yup.object({
      street: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      city: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      state: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      region: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
      country: Yup.string().typeError(" must be a text").min(2, "invalid").trim("empty space not allowed").required("required"),
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
    rate_per_hour: Yup.number().typeError("must be number"),
    signed_on: Yup.string().typeError("must be date").nullable(),
    salary_credit_date: Yup.number().nullable().min(1, 'Must be greater than 0')
      .max(31, 'Must be less than or equal to 31'),
    nc_details: Yup.object({
      dnr: Yup.string().trim().min(2, "invalid").typeError("must be valid text"),
      shift_type_preference: Yup.string().trim().typeError("must be valid text"),
      location_preference: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      more_important_preference: Yup.string().trim().typeError("must be valid text"),
      family_consideration: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      zone_assignment: Yup.string().min(2, "invalid").trim().typeError("must be valid text"),
      vaccine: Yup.string().trim().typeError("must be valid text"),
      covid_facility_preference: Yup.string().trim().typeError("must be valid text"),
      is_fulltime_job: Yup.string().trim().typeError("must be valid "),
      is_supplement_to_income: Yup.string().trim().typeError("must be valid "),
      is_studying: Yup.string().trim().typeError("must be valid "),
      is_gusto_invited: Yup.string().trim().typeError("must be valid "),
      is_gusto_onboarded: Yup.string().trim().typeError("must be valid "),
      gusto_type: Yup.string().trim().typeError("must be valid "),
      nc_last_updated: Yup.string().trim().typeError("must be valid text"),
      last_call_date: Yup.string().typeError("must be date").nullable(),
      contact_type: Yup.string().trim().typeError("must be valid text"),
      other_information: Yup.string().min(2, "invalid").trim().typeError("must be valid text")
    })
  });
  const handleCalcExperience = useCallback(() => {
    const res = calculateExperience(calcExperience)
    setExpInYears(res)
  }, [calcExperience])

  const handleCalcSpecialities = useCallback(() => {
    let specialities = calcExperience?.map((item: any) => item?.specialisation)
    let filteredData = specialities.filter((speciality: any) => speciality !== 'None')
    setSpecialities(filteredData.join(','))
  }, [calcExperience])

  React.useEffect(() => {
    handleCalcExperience()
    handleCalcSpecialities()
  }, [calcExperience, handleCalcExperience, handleCalcSpecialities]);

  const init = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "hcp/" + id).then((resp) => {
      setHcpDetails(resp.data);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, [id]);

  const getEducationDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "hcp/" + id + "/education").then((resp) => {
      setEducations(resp.data || []);
    }).catch((err) => {
      console.log(err);
      setEducations([]);
    });
  }, [id]);

  const getReferenceDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "hcp/" + id + "/reference").then((resp) => {
      setReferences(resp.data || []);
    }).catch((err) => {
      console.log(err);
      setReferences([]);
    });
  }, [id]);

  const getExperienceDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "hcp/" + id + "/experience?exp_type=fulltime").then((resp) => {
      setExperiences(resp.data || []);
      setCalcExperience(resp.data || [])
    }).catch((err) => {
      console.log(err);
      setExperiences([]);
    });
  }, [id]);
  const previewFile = useCallback((index: any, type: any) => {
    console.log(contractFile?.wrapper[0])
    if (type === "contract") {
      setPreviewFile(contractFile?.wrapper[0])
    } else {
      setPreviewFile(fileUpload?.wrapper[index])
    }
    setOpen(true)
  }, [fileUpload, contractFile?.wrapper])

  const cancelPreviewFile = useCallback(() => {
    setOpen(false)
  }, [])
  const confirmPreviewFile = useCallback(() => {
    setOpen(false)
  }, [])


  const getVolunteerExperienceDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "hcp/" + id + "/experience?exp_type=volunteer").then((resp) => {
      setVolunteerExperiences(resp.data || []);
    }).catch((err) => {
      console.log(err);
      setVolunteerExperiences([]);
    });
  }, [id]);

  const getRegions = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
      setRegions(resp.data || []);
      setRegIsLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);


  const getContractDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + 'hcp/' + id + '/contract').then((resp) => {
      setContractDetails(resp.data[0])
      SetIsContractDeleted(false)
    }).catch((err) => {
      console.log(err);
      //  CommonService.showToast(err?.errors || 'Error', 'error');
    });
  }, [id]);

  const getSpecialities = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-specialities").then((resp) => {
      setSpecialitiesMaster(resp.data || []);
      setSpecIsLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const getAttachmentsDetails = useCallback(() => {
    CommonService._api.get(ENV.API_URL + 'hcp/' + id + '/attachments').then((resp) => {
      console.log('api data -all attachments', resp?.data)
      setAttachmentsDetails(resp?.data);
      setIsAttachmentsLoading(false)
    }).catch((err) => {
      console.log(err)
      setIsAttachmentsLoading(false)
    })
  }, [id])

  const deleteContractFileApi = useCallback(() => {
    SetIsContractDeleted(true)
    let payload = {
      "file_key": contractDetails?.file_key
    }
    CommonService._api.delete(ENV.API_URL + 'hcp/' + id + '/contract', payload).then((resp) => {
      getContractDetails()
      CommonService.showToast(resp?.msg || "Hcp Contract Deleted", 'info');
    }).catch((err) => {
      SetIsContractDeleted(false)
      console.log(err);
    });
  }, [id, contractDetails?.file_key, getContractDetails])

  const calculateExperience = (experiences: any[]) => {
    let expArr = experiences.map((item: any) => CommonService.getYearsDiff(item.start_date, item.end_date))
    const sum = expArr.reduce((partial_sum, a) => partial_sum + a, 0);
    return Math.round(sum * 10) / 10
  }

  const deleteAttachment = useCallback((file: any) => {
    setIsDeleted(true)
    let payload = {
      "file_key": file?.file_key
    }
    CommonService._api.delete(ENV.API_URL + 'hcp/' + id + '/attachment', payload).then((resp) => {
      console.log(resp)
      getAttachmentsDetails()
      CommonService.showToast(resp?.msg || "Hcp Attachment Deleted", 'info');
      setIsDeleted(false)
    }).catch((err) => {
      console.log(err)
      setIsDeleted(false)
    });
  }, [id, getAttachmentsDetails])

  const getHcpTypes = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
      setHcpTypes(resp.data || []);
      setHcpTypesLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const OnFileSelected = (files: File[], id: any) => {
    let notselectedAttachment = required_attachments?.filter((item: any) => item?.id !== id)
    let selectedAttachment = required_attachments?.filter((item: any) => item?.id === id)

    if (selectedAttachment[0]) {
      selectedAttachment[0].index = fileUpload?.wrapper?.length || 0
      setRequiredAttachments([...selectedAttachment, ...notselectedAttachment])
    }
    for (let file of files) {
      // console.log(file)
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: 'Data',
        uploadUrl: ENV.API_URL + 'facility/add',
        allowed_types: ['jpg', 'png', 'csv', 'pdf'],
        extraPayload: { expiry_date: '', file_type: selectedAttachment[0]?.attachment_type }
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
        console.log(resp);
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
  }

  useEffect(() => {
    init();
    getSpecialities();
    getEducationDetails();
    getExperienceDetails();
    getVolunteerExperienceDetails();
    getReferenceDetails();
    getRegions();
    getHcpTypes()
    getContractDetails()
    getAttachmentsDetails()
  }, [init, getEducationDetails, getContractDetails, getExperienceDetails, getVolunteerExperienceDetails, getReferenceDetails, getSpecialities, getRegions, getHcpTypes, getAttachmentsDetails]);

  useEffect(() => {
    if (hcpDetails?.status === "approved") {
      Communications.pageTitleSubject.next("Edit HCP");
      Communications.pageBackButtonSubject.next("/hcp/user/list");
    } else {
      Communications.pageTitleSubject.next("Edit HCP");
      Communications.pageBackButtonSubject.next("/hcp/list");
    }
  }, [hcpDetails?.status]);

  useEffect(() => {
    handleHcpTypeChange(hcpDetails?.hcp_type)
  }, [hcpDetails?.hcp_type, handleHcpTypeChange])

  const deleteContractFile = (temp: any) => {
    SetIsContractDeleted(true)
    let data = contractFile?.wrapper.filter((_: any, index: any) => index !== temp);
    setContractFile(prevState => {
      return { wrapper: [...data] };
    })
    SetIsContractDeleted(false)
  }

  const onAddEducation = useCallback((education: any) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + id + "/education", education).then((resp: any) => {
        console.log(resp);
        if (resp && resp.success) {
          resolve(null);
        } else {
          reject(resp);
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }, [id]);

  const OnContractFileUpload = (files: File[]) => {
    for (let file of files) {

      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: 'Data',
        uploadUrl: ENV.API_URL + 'facility/add',
        allowed_types: ['jpg', 'png', 'csv', 'pdf'],
        extraPayload: { expiry_date: '' }
      };
      const uploadWrapper = new TsFileUploadWrapperClass(uploadConfig, CommonService._api, (state: { wrapper: TsFileUploadWrapperClass }) => {

        setContractFile((prevState) => {
          if (prevState) {
            const index = prevState?.wrapper.findIndex((value: any) => value.uploadId === state.wrapper.uploadId);
            prevState.wrapper[index] = state.wrapper;
            return { wrapper: prevState.wrapper };
          }
          return prevState;
        })
      });
      uploadWrapper.onError = (err, heading) => {
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
      };
      setContractFile(prevState => {
        let state: TsFileUploadWrapperClass[] = [];
        if (prevState) {
          state = prevState?.wrapper;
        }
        const newState = [...state, uploadWrapper];
        return { wrapper: newState };
      });
      // uploadWrapper.startUpload();
    }
  }

  const onAddExperience = useCallback((experience: any) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + id + "/experience", experience)
        .then((resp: any) => {
          console.log(resp);
          if (resp && resp.success) {
            resolve(null);
          } else {
            reject(resp);
          }
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, [id]);

  const onAddVolunteerExperience = useCallback((experience: any) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + id + "/experience", experience)
        .then((resp: any) => {
          console.log(resp);
          if (resp && resp.success) {
            resolve(null);
          } else {
            reject(resp);
          }
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
    [id]
  );

  const onAddReference = useCallback((reference: any) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + id + "/reference", reference)
        .then((resp: any) => {
          console.log(resp);
          if (resp && resp.success) {
            resolve(null);
          } else {
            reject(resp);
          }
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, [id]);

  const handleContractFileUpload = useCallback(async (link: any) => {
    const file = contractFile?.wrapper[0].file;
    delete file.base64;
    CommonService._api.upload(link, file, { "Content-Type": file?.type }).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }, [contractFile?.wrapper])

  const handleContractUpload = useCallback((hcpId: any, rate_per_hour, signed_on, salary_credit_date, setSubmitting, setErrors) => {
    let payload = {
      "file_name": contractFile?.wrapper[0]?.file?.name,
      "file_type": contractFile?.wrapper[0]?.file?.type,
      "attachment_type": "contract",
      "rate_per_hour": rate_per_hour,
      "signed_on": signed_on,
      "salary_credit_date": salary_credit_date
    }
    CommonService._api.post(ENV.API_URL + 'hcp/' + hcpId + '/contract', payload).then((resp) => {
      handleContractFileUpload(resp?.data)
    }).catch((err) => {
      console.log(err)
      setSubmitting(false)
      CommonService.handleErrors(setErrors, err);
    })
  }, [handleContractFileUpload, contractFile?.wrapper])


  const onHandleAttachmentUpload = useCallback((value: any, index: any, hcpId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let payload = {
          "file_name": value?.file?.name,
          "file_type": value?.file?.type,
          "attachment_type": value?.extraPayload?.file_type,
          "expiry_date": value?.extraPayload?.expiry_date,
        }
        CommonService._api.post(ENV.API_URL + 'hcp/' + hcpId + '/attachment', payload).then((resp) => {
          if (value) {
            const file = value?.file;
            delete file.base64;
            CommonService._api.upload(resp.data, file, { "Content-Type": value?.file?.type }).then((resp) => {
              console.log(resp)
              resolve(resp)
            }).catch((err) => {
              console.log(err)
            })
          }
        }).catch((err) => {
          console.log(err)
        })

      } catch (error) {
        reject(error)
      }
    })

  }, [])


  const handleAttachmentsUpload = useCallback((hcpId: any, hcpResp: any) => {
    let promArray: any = []

    required_attachments?.forEach((value: any, index: any) => {
      if (value?.index !== -1) {
        promArray.push(onHandleAttachmentUpload(fileUpload?.wrapper[value?.index], index, hcpId))
      }
    });

    console.log(promArray)

    if (promArray.length > 0) {
      Promise.all(promArray).then(resp => {
        if (hcpDetails?.is_approved === true) {
          history.push('/hcp/user/view/' + hcpDetails?.user_id)
        } else {
          history.push('/hcp/view/' + id)
        }
        CommonService.showToast(hcpResp.msg || "Success", "success");
      }).catch(err => console.log(err))
    } else {
      if (hcpDetails?.is_approved === true) {
        history.push('/hcp/user/view/' + hcpDetails?.user_id)
      } else {
        history.push('/hcp/view/' + id)
      }
      CommonService.showToast(hcpResp.msg || "Success", "success");
    }
  }, [fileUpload?.wrapper, history, onHandleAttachmentUpload, hcpDetails?.is_approved, hcpDetails?.user_id, id, required_attachments])

  const onAdd = (hcp: HcpItemAddType, { setSubmitting, setErrors, setFieldValue, resetForm }: FormikHelpers<any>) => {
    setIsHcpSubmitting(true)
    const AddHcp=()=>{
    hcp.contact_number = hcp?.contact_number?.toLowerCase();
    let rate_per_hour = hcp?.rate_per_hour;
    let signed_on = moment(hcp?.signed_on).format('YYYY-MM-DD');
    let salary_credit_date = hcp?.salary_credit_date < 10 ? "0" + hcp?.salary_credit_date?.toString() : hcp?.salary_credit_date?.toString();
    let payload: any = hcp
    delete payload[rate_per_hour]
    delete payload[signed_on]
    delete payload[salary_credit_date]

    payload = {
      ...payload, professional_details: {
        ...payload?.professional_details, experience: expInYears, speciality: specialities
      }
    }
    ApiService.put(ENV.API_URL + "hcp/" + id, payload).then((resp: any) => {
      console.log(resp);
      if (resp && resp.success) {
        if (contractFile?.wrapper[0]?.file) {
          handleContractUpload(id, rate_per_hour, signed_on, salary_credit_date, setSubmitting, setErrors)
        }
        handleAttachmentsUpload(id, resp)

      } else {
        setSubmitting(false);
        setIsHcpSubmitting(false)
      }
    })
      .catch((err) => {
        console.log(err)
        CommonService.handleErrors(setErrors, err);
        setSubmitting(false);
        setIsHcpSubmitting(false)

      });
   }
    if(contractFile?.wrapper[0]?.file){
      if(hcp?.signed_on){
        AddHcp()
      }else{
        CommonService.showToast("Please fill Signed On", "info")
        setSubmitting(false);
        setIsHcpSubmitting(false)
      }
    }else{
      AddHcp()
    }
  };


  const handleExpiryDate = (event: any, index: any) => {
    // console.log(event.target.value, { index })
    setFileUpload(prevState => {
      if (prevState) {
        prevState.wrapper[index].extraPayload.expiry_date = event.target.value;
      }
      return { wrapper: [...(prevState || { wrapper: [] }).wrapper] };
    })
  }


  const deleteLocalAttachment = (index: any) => {
    //let data = fileUpload?.wrapper.filter((elem: any, idx: any) => idx !== index);

    if (required_attachments[index]) {
      required_attachments[index].index = -1
      setRequiredAttachments([...required_attachments])
    }
    CommonService.showToast("Hcp attachment Removed", 'info');
  }

  const showDropDownBelowField = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }

  function RenderSortedAttachments() {
    let filteredData = required_attachments?.filter((item: any) => !attachmentsDetails?.some((item2: any) => item?.attachment_type === item2?.attachment_type))
    // let SortedData = [...filteredData].sort((a: any, b: any) => a?.id - b?.id)
    // let filteredData = filterAvailableDocs()
    return filteredData.map((item: any, index: any) => {
      if (item.index !== -1) {
        return (<>
          <div key={item?.id} className="attachments mrg-top-15">
            {/* {JSON.stringify({ index })} */}
            <br />
            {/* {JSON.stringify({ 'id': item.id })} */}
            <div className="custom_file">
              <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
              <div className="d-flex">
                <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                <div className="file_details mrg-left-20 mrg-top-20">
                  <NormalTextField

                    required
                    label="Expires On:"
                    type={"date"}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => handleExpiryDate(event, item?.index)}
                    value={fileUpload?.wrapper[item?.index]?.extraPayload?.expiry_date}
                    disabled={item?.attachment_type === "SSN Card"}
                  />
                  <div className="file_actions d-flex">
                    <button style={{ cursor: 'pointer' }} onClick={() => previewFile(item?.index, "attachment")} className="delete-button mrg-top-15">View</button>
                    <button style={{ cursor: "pointer", width: '50px' }} disabled={isDeleted} className="delete-button mrg-left-20 mrg-top-15" onClick={() => deleteLocalAttachment(index)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        )
      } else {
        return (
          <div className="attachments">
            <div className="mrg-top-40">
              <h3 className="attachement_name mrg-left-10 file_attachment_title">{item?.attachment_type}</h3>
              <FileDropZoneComponent allowedTypes={".pdf"}
                OnFileSelected={(item1) => OnFileSelected(item1, item?.id)}
              />
            </div>
          </div>
        )
      }
    })
  }

  function RenderAvailableAttachments() {
    return attachmentsDetails?.map((item: any, index: any) => {
      return (
        <div key={index} className="attachments">
          <div className="custom_file">
            <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
            <div className="d-flex">
              <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
              <div className="file_details mrg-left-20 mrg-top-20">
                <NormalTextField
                  label="Expires On"
                  type={"date"}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                  disabled
                  value={item.expiry_date}
                />
                <div className="file_actions">
                  <button style={{ cursor: "pointer", width: '50px' }} className="delete-button mrg-top-15" disabled={isDeleted} onClick={() => deleteAttachment(item)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      )
    })
  }

  function RenderContractAttachments() {
    return contractDetails ? <div className="attachments">
      <div className="custom_file">
        <div className="d-flex">
          <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
          <div className="file_details mrg-left-20">
          </div>
        </div>
        <div className="contract_actions mrg-left-5 mrg-top-10 ">
          <button style={{ cursor: "pointer", width: '50px' }} disabled={isContractDeleted} onClick={deleteContractFileApi} className="delete-button mrg-left-10">Delete</button>
        </div>
      </div>
    </div> : <>
      {contractFile?.wrapper?.map((item: any, index: any) => {
        return (
          <div className="attachments">
            <div className="custom_file">
              <div className="d-flex">
                <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                <div className="file_details mrg-left-20">
                </div>
              </div>
              <div className="d-flex contract_actions mrg-left-5 mrg-top-10">
                <button style={{ cursor: 'pointer' }} onClick={() => previewFile(index, "contract")} className="delete-button">View</button>
                <button style={{ cursor: 'pointer', width: '50px' }} disabled={isContractDeleted} className="mrg-left-20 delete-button" onClick={() => deleteContractFile(index)}>Delete</button>
              </div>
            </div>
          </div>
        );
      })}
      {contractFile?.wrapper.length >= 1 ? (
        <></>
      ) : (
        <Box display="flex" gridGap="10px">
          <Box width="250px" className="mrg-top-10">
            <FileDropZoneComponent allowedTypes={".pdf"}
              OnFileSelected={OnContractFileUpload}
            />
          </Box>
        </Box>
      )}
      <div className="input-container mrg-top-30">
        <Field
          variant='outlined'
          component={TextField}
          type={"text"}
          fullWidth
          autoComplete="off"
          label="Rate / hr"
          name="rate_per_hour"
          required={contractFile?.wrapper[0]?.file}
        />
        <Field
          orientation='landscape'
          variant="inline"
          openTo="date"
          views={["year", "month", "date"]}
          inputVariant='outlined'
          component={DatePicker}
          placeholder="MM/DD/YYYY"
          format="MM/dd/yyyy"
          fullWidth
          autoComplete="off"
          InputLabelProps={{ shrink: true }}
          required={contractFile?.wrapper[0]?.file}
          label="Signed On"
          name="signed_on"
        />
        <Field
          variant='outlined'
          type={"number"}
          component={TextField}
          placeholder="Enter the date of salary credit"
          fullWidth
          autoComplete="off"
          InputLabelProps={{ shrink: true }}
          label="Salary Credit"
          required={contractFile?.wrapper[0]?.file}
          name="salary_credit_date"
        />
      </div>
    </>
  }



  if (isLoading || specIsLoading || regIsLoading || hcpTypesLoading || isAttachmentsLoading) {
    return <div className="add-hcp screen">
      <div className="view-loading-indicator">
        <CircularProgress color="secondary" className="loader" />
      </div>
    </div>
  }


  return (
    !isLoading &&
    !specIsLoading &&
    !regIsLoading && !hcpTypesLoading && !isAttachmentsLoading && (
      <div className="edit-hcp screen">
        <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
          <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
        </DialogComponent>
        <Formik
          initialValues={hcpInitialState}
          validateOnChange={true}
          validationSchema={hcpFormValidation}
          onSubmit={onAdd}
        >
          {({ isSubmitting, isValid, resetForm, setFieldValue }) => (
            <Form id="hcp-edit-form" className={"form-holder"}>
              <ScrollToError />
              <div className="hcp-basic-details">
                <div className="custom-border">
                  <p className='card-header'>Basic Details</p>
                  <div className="input-container">
                    <Field
                      variant='outlined'
                      name="first_name"
                      type={"text"}
                      component={TextField}
                      label="First Name"
                      fullWidth
                      id="input_hcp_edit_first_name"
                      autoComplete="off"
                    />
                    <Field
                      variant='outlined'
                      name="last_name"
                      type={"text"}
                      component={TextField}
                      label="Last Name"
                      fullWidth
                      id="input_hcp_edit_last_name"
                      autoComplete="off"
                    />
                  </div>

                  <div className="input-container">
                    <Field
                      variant='outlined'
                      component={TextField}
                      type={"text"}
                      fullWidth
                      autoComplete="off"
                      label="Email"
                      name="email"
                      id="input_hcp_edit_email"
                      className="flex-1"
                    />
                    <div className="flex-1">
                      <Field
                        name={'contact_number'} className="flex-1">
                        {(field: FieldProps) => {
                          return <PhoneInputComponent field={field} placeholder={'Enter Phone number'} />
                        }}
                      </Field>
                    </div>
                  </div>
                  <div className="input-container">
                    <Field
                      SelectProps={showDropDownBelowField}
                      variant='outlined'
                      onChange={(e: any) => {
                        const hcpType = e.target.value;
                        setFieldValue("hcp_type", hcpType);
                      }}
                      component={TextField}
                      type={"text"}
                      select
                      label="HCP Type"
                      name="hcp_type"
                      id="menu_hcp_edit_hcp_type"
                      fullWidth
                      autoComplete="off"
                    >

                      {hcpTypes.map((item: any, index: number) => (
                        <MenuItem value={item.code} key={index} id={"menu_hcp_edit_hcp_type" + item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Field>

                    <Field
                      SelectProps={showDropDownBelowField}
                      variant='outlined'
                      component={TextField}
                      type={"text"}
                      select
                      label="Gender"
                      name="gender"
                      id="menu_hcp_edit_gender"
                      fullWidth
                      autoComplete="off"
                    >
                      {genderTypes.map((item: any, index: any) => (
                        <MenuItem value={item.value} key={index} id={"menu_hcp_edit_gender_" + item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>

                  <div className="input-container">
                    <Field
                      variant='outlined'
                      name="address.street"
                      type={"text"}
                      component={TextField}
                      label="Street"
                      id="input_hcp_edit_street"
                      fullWidth
                      autoComplete="off"
                    />
                    <Field
                      variant='outlined'
                      name="address.city"
                      type={"text"}
                      id="input_hcp_edit_city"
                      component={TextField}
                      label="City"
                      fullWidth
                      autoComplete="off"
                    />
                  </div>
                  <div className="input-container">
                    <Field
                      SelectProps={showDropDownBelowField}
                      variant='outlined'
                      component={TextField}
                      type={"text"}
                      select
                      label="Region"
                      name="address.region"
                      id="menu_hcp_edit_region"
                      fullWidth
                      autoComplete="off"
                    >
                      {regions &&
                        regions.map((item: any, index: any) => (
                          <MenuItem value={item.name} key={index} id={"menu_hcp_edit_region" + item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Field>

                    <Field
                      variant='outlined'
                      name="address.state"
                      type={"text"}
                      component={TextField}
                      label="State"
                      id="input_hcp_edit_state"
                      fullWidth
                      autoComplete="off"
                    />
                  </div>
                  <div className="input-container ">
                    <Field
                      inputProps={{
                        maxLength: 6
                      }}
                      variant='outlined'
                      fullWidth
                      name="address.zip_code"
                      type={"text"}
                      component={TextField}
                      label="Zip"
                      id="input_hcp_edit_zip"
                      autoComplete="off"
                    />
                    <Field
                      variant='outlined'
                      name="address.country"
                      type={"text"}
                      component={TextField}
                      label="Country"
                      fullWidth
                      id="input_hcp_edit_country"
                      autoComplete="off"
                    />
                  </div>

                  <div className="facility-about mrg-top-10">
                    <p className='card-header'>About the HCP</p>
                    <Field
                      variant='outlined'
                      component={TextField}
                      type={"text"}
                      fullWidth
                      autoComplete="off"
                      id="input_hcp_edit_about"
                      name="about"
                      multiline
                      rows={2}
                    />
                  </div>
                </div>

                <div className="hcp-profession-details  mrg-top-10 custom-border">
                  <p className='card-header'>Professional Details (Based On Work Experience)</p>
                  <div className="input-container">
                    <Field
                      value={expInYears}
                      disabled
                      variant='outlined'
                      component={TextField}
                      label="Years of Experience"
                      name="professional_details.experience"
                      id="input_hcp_edit_proffesional_details"
                      fullWidth
                      autoComplete="off"
                    />
                  </div>
                  <div className="input-container ">
                    <Field
                      value={specialities}
                      disabled
                      variant='outlined'
                      component={TextField}
                      type={"text"}
                      label="Specialities"
                      id="input_hcp_edit_speciality"
                      name="professional_details.speciality"
                      fullWidth
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="professional-summary mrg-top-10 custom-border">
                  <p className='card-header'>Professional Summary</p>
                  <Field
                    variant='outlined'
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="professional_details.summary"
                    id="input_hcp_edit_summary"
                    multiline
                    rows={2}
                  />
                </div>
              </div>
              <div className="nc-section custom-border mrg-top-10" >
                <p className="card-header">NC Section</p>
                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.dnr"
                    type={"text"}
                    component={TextField}
                    label="DNR"
                    id="input_hcp_add_dnr"
                    fullWidth
                    autoComplete="off"
                  />
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.vaccine"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_vaccine"
                    label="Vaccine"
                    fullWidth
                    autoComplete="off"
                  >
                    {vaccine.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_vaccine_" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.location_preference"
                    type={"text"}
                    component={TextField}
                    label="Preferred Location to Work"
                    id="input_hcp_add_location_preference"
                    fullWidth
                    autoComplete="off"
                  />
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.contact_type"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_contact_type"
                    label="Contact Type"
                    fullWidth
                    autoComplete="off"
                  >
                    {contactType.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_contact_type" + index}>{item.label}</MenuItem>
                    ))}

                  </Field>

                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.shift_type_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_shift_type_preference"
                    label="Preference Shift Type"
                    fullWidth
                    autoComplete="off"
                  >
                    {shiftTypePreference.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_shift_type_preference" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>

                  <Field
                    SelectProps={showDropDownBelowField}

                    select
                    variant='outlined'
                    name="nc_details.covid_facility_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_covid_preference"
                    label="Covid (or) Non Covid Facility?"
                    fullWidth
                    autoComplete="off"
                  >
                    {covidPreference.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_covid_preference" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>


                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.zone_assignment"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_zone_assignment"
                    label="Zone Assignment"
                    fullWidth
                    autoComplete="off"
                  />

                  <Field
                    SelectProps={showDropDownBelowField}

                    select
                    variant='outlined'
                    name="nc_details.is_fulltime_job"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_is_fulltime_job"
                    label="Do you have a Full-time Job?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_fulltime_job" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>


                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.more_important_preference"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_more_important_preference"
                    label="What is more important for you?"
                    fullWidth
                    autoComplete="off"
                  >
                    {moreImportant.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_more_important_preference" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.is_supplement_to_income"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_is_supplement_to_income"
                    label="Is this a Supplement to your Income ?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_supplement_to_income" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.is_studying"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_is_studying"
                    label="Are you Studying?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_studying" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>

                  <Field
                    select
                    variant='outlined'
                    name="nc_details.gusto_type"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_gusto_type"
                    label="Gusto"
                    fullWidth
                    autoComplete="off"
                  >
                    {gustoType.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_gusto_type" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>
                </div>

                <div className="input-container">
                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.is_gusto_invited"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_is_gusto_invited"
                    label="Is Gusto Invited ?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_gusto_invited" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>

                  <Field
                    SelectProps={showDropDownBelowField}
                    select
                    variant='outlined'
                    name="nc_details.is_gusto_onboarded"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_is_gusto_onboarded"
                    label="Is Gusto Onboarded ?"
                    fullWidth
                    autoComplete="off"
                  >
                    {boolAcknowledge.map((item: any, index: any) => (
                      <MenuItem value={item.value} id={"menu_hcp_add_is_gusto_onboarded" + index}>{item.label}</MenuItem>
                    ))}
                  </Field>


                </div>

                <div className="input-container">
                  <Field
                    variant="inline"
                    openTo="date"
                    inputVariant='outlined'
                    component={DateTimePicker}
                    id="input_hcp_add_last_call_date"
                    placeholder="MM/DD/YYYY HH:MM "
                    fullWidth
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    label="Last Call Date"
                    name="nc_details.last_call_date"
                  />
                  <Field
                    variant='outlined'
                    name="nc_details.family_consideration"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_family_consideration"
                    label="Family Considerations"
                    fullWidth
                    autoComplete="off"
                  />
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    name="nc_details.other_information"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_other_information"
                    label="Other Information Gathered"
                    fullWidth
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="custom-border mrg-top-10 pdd-top-10 pdd-left-40 pdd-right-40 pdd-bottom-40">
                <h3 className="card-header">Documents/Attachments</h3>
                <div className="attachments_wrapper mrg-top-30">
                  {RenderAvailableAttachments()}
                  {RenderSortedAttachments()}
                </div>
              </div>

              <div className="mrg-top-10 custom-border">
                <p className="card-header">Contract</p>
                {RenderContractAttachments()}
              </div>

            </Form>
          )}
        </Formik>
        <div className="mrg-top-0 custom-border ">
          <p className='card-header'>Education</p>
          <EducationAddComponent
            getEducationDetails={getEducationDetails}
            onAddEducation={onAddEducation}
            hcpId={id}
            education={educations}
            setEducation={setEducations}
          />
        </div>

        <div className="mrg-top-0 custom-border ">
          <p className='card-header'>Work Experience</p>
          <ExperienceEditComponent
            hcpTypeSpecialities={hcpTypeSpecialities}
            hcpTypes={hcpTypes}
            handleHcpTypeChange={handleHcpTypeChange}
            getExperienceDetails={getExperienceDetails}
            hcpId={id}
            onAddExperience={onAddExperience}
            experiences={experiences}
            setExperience={setExperiences}

          />
        </div>

        <div className="mrg-top-0 custom-border">
          <p className='card-header'>Volunteer Experience</p>
          <VolunteerExperienceEditComponent
            getExperienceDetails={getVolunteerExperienceDetails}
            hcpId={id}
            onAddExperience={onAddVolunteerExperience}
            experiences={volunteerExperiences}
            setExperience={setVolunteerExperiences}
          />
        </div>
        <div className="mrg-top-0 custom-border ">
          <p className='card-header'>References</p>
          <ReferenceAddComponent
            getReferenceDetails={getReferenceDetails}
            hcpId={id}
            onAddReference={onAddReference}
            reference={references}
            setReference={setReferences}
          />
        </div>
        <div className="add-hcp-actions mrg-top-80">
          <Button
            size="large"
            onClick={() => hcpDetails?.is_approved === true ? history.push('/hcp/user/view/' + hcpDetails?.user_id) : history.push('/hcp/view/' + id)}
            variant={"outlined"}
            color="primary"
            id="btn_hcp_edit_cancel">Cancel</Button>
          <Button
            disabled={isHcpSubmitting}
            form="hcp-edit-form"
            type="submit"
            size="large"
            id="btn_hcp_edit_submit"
            variant={"contained"}
            color={"primary"}
          >
            {isHcpSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
        <ScrollToTop smooth color="white" />
      </div>
    )
  );
};

export default EditHcpComponent;