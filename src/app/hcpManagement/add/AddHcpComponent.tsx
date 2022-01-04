import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, CircularProgress, MenuItem } from "@material-ui/core";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker, DateTimePicker } from "formik-material-ui-pickers";
import moment from "moment";
import 'react-phone-number-input/style.css';
import { useHistory } from "react-router";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from '../../../classes/ts-file-upload-wrapper.class';
import FileDropZoneComponent from '../../../components/core/FileDropZoneComponent';
import PhoneInputComponent from "../../../components/phoneInput/PhoneInputComponent";
import { ENV } from "../../../constants";
import { boolAcknowledge, contactType, covidPreference, genderTypes, gustoType, moreImportant, shiftTypePreference, vaccine } from "../../../constants/data";
import { ApiService, CommonService, Communications } from "../../../helpers";
import "./AddHcpComponent.scss";
import EducationAddComponent from "./EducationAddComponent/EducationAddComponent";
import ExperienceAddComponent from "./ExperienceAddComponent/ExperienceAddComponent";
import ReferenceAddComponent from "./ReferenceAddComponent/ReferenceAddComponent";
import VolunteerExperienceAddComponent from "./VolunteerExperienceAddComponent/VolunteerExperienceAddComponent";
import ScrollToTop from "react-scroll-to-top";
import DialogComponent from "../../../components/DialogComponent";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { ScrollToError } from "./ScrollToError";
import { AddHcpInitialValues, HcpItemAddType, hcpFormValidation } from "./AddHcpValuesValidationsComponent";
import HcpAddAttachmentsComponent from "./AddAtachments/HcpAddAttachmentsComponent";

const AddHcpComponent = () => {
  const history = useHistory();
  const [educations, setEducations] = useState<any>([]);
  const [experiences, setExperiences] = useState<any>([]);
  const [specialities, setSpecialities] = useState<any>([]);
  const [volunteerExperiences, setVolunteerExperiences] = useState<any>([]);
  const [references, setReferences] = useState<any>([]);
  const [regions, setRegions] = useState<any>([]);
  const [required_attachments, setRequiredAttachments] = useState<any>([
    { name: "Physical Test", index: -1 },
    { name: "TB Test", index: -1 },
    { name: "Chest X-ray", index: -1 },
    { name: "CPR/BLS Card", index: -1 },
    { name: "Driver's Licence", index: -1 },
    { name: "SSN Card", index: -1 },
    { name: "License", index: -1 },
    { name: "Covid Certificate", index: -1 },
    { name: "Covid Vaccine Card", index: -1 },
    { name: "Covid Test Result", index: -1 },
    { name: "Livescan", index: -1 },
    { name: "Vaccine Exemption Letter", index: -1 }
  ])
  const [specIsLoading, setSpecIsLoading] = useState<boolean>(true);
  const [regIsLoading, setRegIsLoading] = useState<boolean>(true);
  const [hcpTypesLoading, setHcpTypesLoading] = useState<boolean>(true);
  const [specialitiesMaster, setSpecialitiesMaster] = useState<any>([]);
  const [hcpTypeSpecialities, setHcpTypeSpecialities] = useState<any>([]);
  const [hcpTypes, setHcpTypes] = useState<any>([])
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [contractFile, setContractFile] = useState<{ wrapper: any } | null>(null);
  const [isHcpSubmitting, setIsHcpSubmitting] = useState<boolean>(false);
  const [expInYears, setExpInYears] = useState<number>(0)
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  let hcpInitialState: HcpItemAddType = AddHcpInitialValues;

  const getSpecialities = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-specialities").then((resp) => {
      setSpecialitiesMaster(resp.data || []);
      setSpecIsLoading(false);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRegions = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-regions").then((resp) => {
      setRegions(resp.data || []);
      setRegIsLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const previewFile = useCallback((index: any, type: any) => {
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

  const getHcpTypes = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
      setHcpTypes(resp.data || []);
      setHcpTypesLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    Communications.pageTitleSubject.next("Add HCP");
    Communications.pageBackButtonSubject.next("/hcp/list");
    getRegions();
    getSpecialities();
    getHcpTypes();
  }, [getRegions, getSpecialities, getHcpTypes]);

  const onAddEducation = useCallback((education: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/education", education).then((resp: any) => {
        console.log(resp);
        if (resp && resp.success) {
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
  }, []);

  const addEducations = useCallback((hcpId: string) => {
    (educations || []).forEach((value: any) => {
      onAddEducation(value, hcpId);
    });
  }, [educations, onAddEducation]);

  const onAddExperience = useCallback((experience: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/experience", experience).then((resp: any) => {
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
  }, []);

  const addExperiences = useCallback((hcpId: string) => {
    (experiences || []).forEach((value: any) => {
      onAddExperience(value, hcpId);
    });
  }, [experiences, onAddExperience]);

  const onAddVolunteerExperience = useCallback((experience: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/experience", experience).then((resp: any) => {
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
  }, []);

  const addVolunteerExperiences = useCallback((hcpId: string) => {
    (volunteerExperiences || []).forEach((value: any) => {
      onAddVolunteerExperience(value, hcpId);
    });
  }, [volunteerExperiences, onAddVolunteerExperience]);

  const onAddReference = useCallback((reference: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/reference", reference)
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
  }, []);

  const addReferences = useCallback((hcpId: string) => {
    (references || []).forEach((value: any) => {
      onAddReference(value, hcpId);
    });
  }, [references, onAddReference]);


  const onAdd = (hcp: HcpItemAddType, { setSubmitting, setErrors, resetForm, setFieldValue }: FormikHelpers<any>) => {
    setIsHcpSubmitting(true)
    const AddHcp=()=>{
    hcp.contact_number = hcp?.contact_number?.toLowerCase();
    let rate_per_hour = hcp?.rate_per_hour;
    let signed_on = moment(hcp?.signed_on).format('YYYY-MM-DD');
    let salary_credit_date = hcp?.salary_credit_date < 10 ? "0" + hcp?.salary_credit_date?.toString() : hcp?.salary_credit_date?.toString();
    let payload: any = {}
    payload = hcp
    payload = {
      ...payload,
      professional_details: {
        ...payload.professional_details,
        experience: expInYears, speciality: specialities.join(',')

      }
    }

    delete payload[rate_per_hour]
    delete payload[signed_on]
    delete payload[salary_credit_date]
    ApiService.post(ENV.API_URL + "hcp", payload).then((resp: any) => {
      if (resp && resp.success) {
        const hcpId = resp.data._id;
        addEducations(hcpId);
        addReferences(hcpId);
        addExperiences(hcpId);
        addVolunteerExperiences(hcpId);
        handleContractUpload(hcpId, rate_per_hour, signed_on, salary_credit_date)
        handleAttachmentsUpload(hcpId, resp)
      } else {
        setSubmitting(false);
      }
    })
      .catch((err) => {
        console.log(err)
        setSubmitting(false);
        CommonService.handleErrors(setErrors, err);
        setIsHcpSubmitting(false)
        CommonService.showToast(err?.msg || "Error", "error");
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

  const handleHcpTypeChange = (hcp_type: string) => {
    const selectedSpeciality = specialitiesMaster[hcp_type];
    setHcpTypeSpecialities(selectedSpeciality);
  };

  const handleContractFileUpload = useCallback((link: any) => {
    const file = contractFile?.wrapper[0].file;
    delete file.base64;
    CommonService._api.upload(link, file, { "Content-Type": file?.type }).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }, [contractFile])

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


  const handleAttachmentsUpload = useCallback(async (hcpId: any, hcpResp: any) => {
    let promArray: any = []

    required_attachments?.forEach((value: any, index: any) => {
      if (value?.index !== -1) {
        promArray.push(onHandleAttachmentUpload(fileUpload?.wrapper[value?.index], index, hcpId))
      }
    });

    console.log(promArray)

    if (promArray.length > 0) {
      Promise.all(promArray).then(resp => {
        console.log({ resp })
        history.push("/hcp/view/" + hcpId)
      }).catch(err => console.log(err))
    } else {
      CommonService.showToast(hcpResp.msg || "Success", "success");
      history.push("/hcp/view/" + hcpId)
    }

  }, [fileUpload?.wrapper, onHandleAttachmentUpload, history, required_attachments])

  const handleContractUpload = useCallback((hcpId: any, rate_per_hour, signed_on, salary_credit_date) => {
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
      CommonService.showToast(err, 'error');
    })
  }, [handleContractFileUpload, contractFile?.wrapper])

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

  const deleteContractFile = (temp: any) => {
    let data = contractFile?.wrapper.filter((_: any, index: any) => index !== temp);
    setContractFile(prevState => {
      return { wrapper: [...data] };
    })
  }

  const calculateExperience = (experiences: any[]) => {
    let expArr = experiences.map((item: any) => CommonService.getYearsDiff(item.start_date, item.end_date))
    const sum = expArr.reduce((partial_sum, a) => partial_sum + a, 0);
    return Math.round(sum * 10) / 10

  }


  const handleCalcExperience = (exp: any) => {
    const res = calculateExperience(exp)
    setExpInYears(res)
  }


  const handleCalcSpecialities = (exp: any) => {
    let specialities = exp.map((item: any) => item?.specialisation)
    let filteredSpecs = specialities.filter((spec: any) => spec !== 'None')
    setSpecialities(filteredSpecs)
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


  if (specIsLoading || regIsLoading || hcpTypesLoading) {
    return <div className="add-hcp screen">
      <div className="view-loading-indicator">
        <CircularProgress color="secondary" className="loader" />
      </div>
    </div>
  }

  return !specIsLoading && !regIsLoading && !hcpTypesLoading && (<>
    <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
      <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
    </DialogComponent>
    <div className="add-hcp screen">
      <Formik
        initialValues={hcpInitialState}
        validateOnChange={true}
        validationSchema={hcpFormValidation}
        onSubmit={onAdd}>
        {({ isSubmitting, isValid, resetForm, handleChange, values, setFieldValue }) => (
          <Form id="add-hcp-form" className={"form-holder"}>
            <div >
              <div className="custom-border">
                <p className='card-header'>Basic Details</p>
                <div className="input-container">
                  <Field
                    variant='outlined'
                    required
                    name="first_name"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_first_name"
                    label="First Name"
                    fullWidth
                    autoComplete="off"
                  />
                  <Field
                    variant='outlined'
                    required
                    name="last_name"
                    id="input_hcp_add_last_name"
                    type={"text"}
                    component={TextField}
                    label="Last Name"
                    fullWidth
                    autoComplete="off"
                  />
                </div>

                <div className="input-container">
                  <Field
                    variant='outlined'
                    component={TextField}
                    type={"email"}
                    fullWidth
                    autoComplete="off"
                    className="flex-1"
                    label="Email*"
                    name="email"
                    id="input_hcp_add_email"
                  />

                  <div className="flex-1">
                    <Field
                      name={'contact_number'} className="flex-1">
                      {(field: FieldProps) => {
                        return <PhoneInputComponent field={field} placeholder={'Enter Phone number*'} />
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
                    label="HCP Type*"
                    id="menu_hcp_add_hcp_type"
                    name="hcp_type"
                    fullWidth
                    autoComplete="off"
                  >
                    {hcpTypes.map((item: any, index: number) => (
                      <MenuItem value={item.code} key={'hcp_type_' + index} id={"menu_hcp_add_hcp_type" + item.name}>
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
                    label="Gender*"
                    name="gender"
                    id="menu_hcp_add_gender"
                    fullWidth
                    autoComplete="off"
                  >
                    {genderTypes.map((item: any, index) => (
                      <MenuItem value={item.value} key={'gender_type_' + index} id={"menu_hcp_add_gender_" + item.value}>
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
                    label="Street*"
                    id="input_hcp_add_street"
                    fullWidth
                    autoComplete="off"
                  />
                  <Field
                    variant='outlined'
                    name="address.city"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_city"
                    label="City*"
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
                    label="Region*"
                    name="address.region"
                    id="menu_hcp_add_region"
                    fullWidth
                    autoComplete="off"
                  >
                    {regions &&
                      regions.map((item: any, index: any) => (
                        <MenuItem value={item.code} key={'region_' + index} id={"menu_hcp_add_region" + item.code}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Field>
                  <Field
                    variant='outlined'
                    name="address.state"
                    id="input_hcp_add_state"
                    type={"text"}
                    component={TextField}
                    label="State*"
                    fullWidth
                    autoComplete="off"
                  />
                </div>
                <div className="input-container">
                  <Field
                    inputProps={{
                      maxLength: 6
                    }}
                    variant='outlined'
                    fullWidth
                    name="address.zip_code"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_zip"
                    label="Zip*"
                    autoComplete="off"
                  />
                  <Field
                    variant='outlined'
                    name="address.country"
                    type={"text"}
                    component={TextField}
                    id="input_hcp_add_country"
                    label="Country*"
                    fullWidth
                    autoComplete="off"
                  />
                </div>
                <div className="facility-about mrg-top-50">
                  <p className='card-header'>About the HCP</p>
                  <Field
                    placeholder="About the Hcp"
                    variant='outlined'
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="about"
                    id="input_hcp_add_about"
                    multiline
                    rows={2}
                  />
                </div>
              </div>
              <div className="hcp-profession-details  mrg-top-10 custom-border">
                <p className='card-header'>Professional Details (Based on Work Experience)</p>
                <div className="input-container">
                  <Field
                    value={expInYears}
                    disabled
                    variant='outlined'
                    component={TextField}
                    label="Years of Experience"
                    name="professional_details.experience"
                    id="input_hcp_add_proffesional_details"
                    fullWidth
                    autoComplete="off"
                  />
                </div>
                <div className="input-container professional-details">
                  <Field
                    value={specialities.join(',')}
                    disabled
                    variant='outlined'
                    component={TextField}
                    type={"text"}
                    label="Specialities"
                    id="input_hcp_add_speciality"
                    name="professional_details.speciality"
                    fullWidth
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="custom-border">
                <div className="professional-summary mrg-top-10">
                  <p className='card-header'>Professional Summary</p>
                  <Field
                    variant='outlined'
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    name="professional_details.summary"
                    id="input_hcp_add_summary"
                    multiline
                    rows={2}
                    placeholder="Enter Professional Summary"
                  />
                </div>
              </div>
              <div className="hcp-documents mrg-top-10 custom-border">
                <h3 className="card-header">Documents/Attachments</h3>
                <HcpAddAttachmentsComponent required_attachments={required_attachments} setRequiredAttachments={setRequiredAttachments} fileUpload={fileUpload} setFileUpload={setFileUpload} previewFile={previewFile}/>
              </div>
              <div className="custom-border mrg-top-10">
                <div className="attachments_wrapper  mrg-bottom-30">
                  {contractFile?.wrapper?.map((item: any, index: any) => {
                    return (
                      <div className="attachments">
                        <h3 className="mrg-top-10 mrg-bottom-10 file_name card-header">{"Contract"}</h3>
                        <div className="custom_file">
                          <div className="d-flex">
                            <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                          </div>
                          <div className="d-flex contract_actions mrg-top-5 mrg-left-5">
                            <p style={{ cursor: 'pointer' }} onClick={() => previewFile(index, "contract")} className="delete-image">View</p>
                            <p style={{ cursor: 'pointer', width: '50px' }} className="mrg-left-20" onClick={() => deleteContractFile(index)}>Delete</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {contractFile?.wrapper.length >= 1 ? (
                  <></>
                ) : (
                  <div >
                    <h3 className="card-header">Contract</h3>
                    <Box display="flex" gridGap="10px">
                      <Box width="250px" className="mrg-top-10">
                        <FileDropZoneComponent allowedTypes={".pdf"}
                          OnFileSelected={OnContractFileUpload}
                        />
                      </Box>
                    </Box>
                  </div>
                )}
                <div className="input-container mrg-top-30">
                  <Field
                    placeholder="Rate/hr"
                    variant='outlined'
                    component={TextField}
                    type={"text"}
                    fullWidth
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    required={contractFile?.wrapper[0]?.file}
                    label="Rate/hr"
                    name="rate_per_hour"
                  />
                  <Field
                    variant="inline"
                    orientation="landscape"
                    openTo="date"
                    format="MM/dd/yyyy"
                    views={["year", "month", "date"]}
                    inputVariant='outlined'
                    component={DatePicker}
                    required={contractFile?.wrapper[0]?.file}
                    placeholder="MM/DD/YYYY"
                    fullWidth
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
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
                    SelectProps={showDropDownBelowField}
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
            </div>
            <ScrollToError />
          </Form>
        )}
      </Formik>
      <div className="mrg-top-0 custom-border">
        <p className='card-header'>Education</p>
        <EducationAddComponent
          educations={educations}
          setEducation={setEducations}
        />
      </div>
      <div className="mrg-top-0 custom-border">
        <p className='card-header'>Work Experience</p>
        <ExperienceAddComponent
          handleCalcSpecialities={handleCalcSpecialities}
          handleCalcExperience={handleCalcExperience}
          hcpTypeSpecialities={hcpTypeSpecialities}
          hcpTypes={hcpTypes}
          handleHcpTypeChange={handleHcpTypeChange}
          experiences={experiences}
          setExperience={setExperiences}
        />
      </div>
      <div className="mrg-top-0 custom-border">
        <p className='card-header'>Volunteer Experience</p>
        <VolunteerExperienceAddComponent
          experiences={volunteerExperiences}
          setExperience={setVolunteerExperiences}
        />
      </div>
      <div className="mrg-top-0 custom-border">
        <p className='card-header'>References</p>
        <ReferenceAddComponent
          references={references}
          setReference={setReferences}
        />
      </div>
      <div className="add-hcp-actions mrg-top-80">
        <Button size="large" onClick={() => history.push('/hcp/list')} variant={"outlined"}    color="primary" id="btn_hcp_add_cancel">{"Cancel"}</Button>
        <Button
          disabled={isHcpSubmitting}
          form="add-hcp-form"
          type="submit"
          size="large"
          id="btn_hcp_add_save"
          variant={"contained"}
          color={"primary"}
        >
          {isHcpSubmitting ? "Saving" : "Save"}
        </Button>
      </div>
      <ScrollToTop smooth color="white" />
    </div>
  </>
  )
};

export default AddHcpComponent;
