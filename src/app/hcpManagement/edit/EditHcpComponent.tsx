import { Button } from "@material-ui/core";
import { FormikHelpers } from "formik";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import 'react-phone-number-input/style.css';
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import DialogComponent from "../../../components/DialogComponent";
import LoaderComponent from "../../../components/LoaderComponent";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import LeavePageConfirmationComponent from "../../../components/shared/LeavePageConfirmationComponent";
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import { HcpItemAddType } from "../add/AddHcpValuesValidationsComponent";
import EditHcpBasicDetailsComponent from "./BasicDetails/EditHcpBasicDetailsComponent";
import "./EditHcpComponent.scss";
import EducationAddComponent from "./EducationEditComponent/EducationEditComponent";
import ExperienceEditComponent from "./ExperienceEditComponent/ExperienceEditComponent";
import ReferenceAddComponent from "./ReferenceEditComponent/ReferenceEditComponent";
import VolunteerExperienceEditComponent from "./VolunteerExperienceEditComponent/VolunteerExperienceEditComponent";

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
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);


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
      // console.log('api data -all attachments', resp?.data)
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
    let selectedAttachment = required_attachments?.filter((item: any) => item?.id === id)
    if (selectedAttachment[0]) {
      required_attachments[(selectedAttachment[0]?.id) - 1].index = fileUpload?.wrapper?.length || 0
      setRequiredAttachments([...required_attachments])
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
      Communications.pageBackButtonSubject.next(null);
    } else {
      Communications.pageTitleSubject.next("Edit HCP");
      Communications.pageBackButtonSubject.next(null);
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
    const AddHcp = () => {
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
    if (contractFile?.wrapper[0]?.file) {
      if (hcp?.signed_on) {
        AddHcp()
      } else {
        CommonService.showToast("Please fill Signed On", "info")
        setSubmitting(false);
        setIsHcpSubmitting(false)
      }
    } else {
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

  const openAdd = useCallback(() => {
    setIsAddOpen(true)
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    hcpDetails?.is_approved === true ? history.push('/hcp/user/view/' + hcpDetails?.user_id) : history.push('/hcp/view/' + id)
  }, [history, hcpDetails?.is_approved, hcpDetails?.user_id, id])

  if (isLoading || specIsLoading || regIsLoading || hcpTypesLoading || isAttachmentsLoading) {
    return <LoaderComponent />
  }


  return (
    !isLoading &&
    !specIsLoading &&
    !regIsLoading && !hcpTypesLoading && !isAttachmentsLoading && (
      <div className="edit-hcp screen">
        <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
          <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
        </DialogComponent>
        <DialogComponent open={isAddOpen} cancel={cancelAdd}>
          <LeavePageConfirmationComponent cancel={cancelAdd} confirm={confirmAdd} confirmationText={''} notext={"Cancel"} yestext={"Leave"} />
        </DialogComponent>
        <EditHcpBasicDetailsComponent
          isContractDeleted={isContractDeleted}
          contractFile={contractFile}
          fileUpload={fileUpload}
          onAdd={onAdd}
          hcpTypes={hcpTypes}
          regions={regions}
          specialities={specialities}
          hcpInitialState={hcpInitialState}
          expInYears={expInYears}
          required_attachments={required_attachments}
          OnContractFileUpload={OnContractFileUpload}
          deleteContractFile={deleteContractFile}
          OnFileSelected={OnFileSelected}
          deleteAttachment={deleteAttachment}
          isDeleted={isDeleted}
          attachmentsDetails={attachmentsDetails}
          deleteContractFileApi={deleteContractFileApi}
          previewFile={previewFile}
          contractDetails={contractDetails}
          handleExpiryDate={handleExpiryDate}
          deleteLocalAttachment={deleteLocalAttachment} />
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
            onClick={openAdd}
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
            className={isHcpSubmitting ? 'has-loading-spinner' : ''}
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