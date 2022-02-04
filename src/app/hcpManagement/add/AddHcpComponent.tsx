import { Button, Tooltip } from "@material-ui/core";
import { FormikHelpers } from "formik";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router";
import ScrollToTop from "react-scroll-to-top";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import DialogComponent from "../../../components/DialogComponent";
import LoaderComponent from "../../../components/LoaderComponent";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import LeavePageConfirmationComponent from "../../../components/shared/LeavePageConfirmationComponent";
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import "./AddHcpComponent.scss";
import { HcpItemAddType } from "./AddHcpValuesValidationsComponent";
import AddHcpBasicDetailsComponent from "./BasicDetails/AddHcpBasicDetailsComponent";
import EducationAddComponent from "./EducationAddComponent/EducationAddComponent";
import ExperienceAddComponent from "./ExperienceAddComponent/ExperienceAddComponent";
import ReferenceAddComponent from "./ReferenceAddComponent/ReferenceAddComponent";
import VolunteerExperienceAddComponent from "./VolunteerExperienceAddComponent/VolunteerExperienceAddComponent";

const AddHcpComponent = () => {
  const history = useHistory();
  const [educations, setEducations] = useState<any>([]);
  const [experiences, setExperiences] = useState<any>([]);
  const [specialities, setSpecialities] = useState<any>([]);
  const [volunteerExperiences, setVolunteerExperiences] = useState<any>([]);
  const [references, setReferences] = useState<any>([]);
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
    { name: "Vaccine Exemption Letter", index: -1 },
  ]);
  const [specIsLoading, setSpecIsLoading] = useState<boolean>(true);
  const [regIsLoading, setRegIsLoading] = useState<boolean>(true);
  const [hcpTypesLoading, setHcpTypesLoading] = useState<boolean>(true);
  const [specialitiesMaster, setSpecialitiesMaster] = useState<any>([]);
  const [hcpTypeSpecialities, setHcpTypeSpecialities] = useState<any>([]);
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [contractFile, setContractFile] = useState<{ wrapper: any } | null>(null);
  const [isHcpSubmitting, setIsHcpSubmitting] = useState<boolean>(false);
  const [expInYears, setExpInYears] = useState<number>(0);
  const [hcpTypes, setHcpTypes] = useState<any>([]);
  const [regions, setRegions] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const getSpecialities = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "meta/hcp-specialities")
      .then((resp) => {
        setSpecialitiesMaster(resp.data || []);
        setSpecIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRegions = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "meta/hcp-regions")
      .then((resp) => {
        setRegions(resp.data || []);
        setRegIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const cancelPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);
  const confirmPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);

  const onAddEducation = useCallback((education: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/education", education)
        .then((resp: any) => {
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

  const addEducations = useCallback(
    (hcpId: string) => {
      (educations || []).forEach((value: any) => {
        onAddEducation(value, hcpId);
      });
    },
    [educations, onAddEducation]
  );

  const onAddExperience = useCallback((experience: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/experience", experience)
        .then((resp: any) => {
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

  const addExperiences = useCallback(
    (hcpId: string) => {
      (experiences || []).forEach((value: any) => {
        onAddExperience(value, hcpId);
      });
    },
    [experiences, onAddExperience]
  );

  const onAddVolunteerExperience = useCallback((experience: any, hcpId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "hcp/" + hcpId + "/experience", experience)
        .then((resp: any) => {
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

  const addVolunteerExperiences = useCallback(
    (hcpId: string) => {
      (volunteerExperiences || []).forEach((value: any) => {
        onAddVolunteerExperience(value, hcpId);
      });
    },
    [volunteerExperiences, onAddVolunteerExperience]
  );

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
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, []);

  const addReferences = useCallback(
    (hcpId: string) => {
      (references || []).forEach((value: any) => {
        onAddReference(value, hcpId);
      });
    },
    [references, onAddReference]
  );

  const onAdd = (hcp: HcpItemAddType, { setSubmitting, setErrors, resetForm, setFieldValue }: FormikHelpers<any>) => {
    setIsHcpSubmitting(true);
    const AddHcp = () => {
      hcp.contact_number = hcp?.contact_number?.toLowerCase();
      hcp.contract_details.signed_on = hcp?.contract_details?.signed_on ? moment(hcp?.contract_details?.signed_on).format("YYYY-MM-DD") : null;
      let payload: any = {};
      payload = hcp;

      payload = {
        ...payload,
        professional_details: {
          ...payload.professional_details,
          experience: expInYears,
          speciality: specialities.join(","),
        },
      };

      ApiService.post(ENV.API_URL + "hcp", payload)
        .then((resp: any) => {
          if (resp && resp.success) {
            const hcpId = resp.data._id;
            addEducations(hcpId);
            addReferences(hcpId);
            addExperiences(hcpId);
            addVolunteerExperiences(hcpId);
            handleContractUpload(hcpId);
            handleAttachmentsUpload(hcpId, resp);
          } else {
            setSubmitting(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          CommonService.handleErrors(setErrors, err);
          setIsHcpSubmitting(false);
          CommonService.showToast(err?.msg || "Error", "error");
        });
    };
    AddHcp();
  };

  const handleHcpTypeChange = (hcp_type: string) => {
    const selectedSpeciality = specialitiesMaster[hcp_type];
    setHcpTypeSpecialities(selectedSpeciality);
  };

  const handleContractFileUpload = useCallback(
    (link: any) => {
      const file = contractFile?.wrapper[0].file;
      delete file.base64;
      CommonService._api
        .upload(link, file, { "Content-Type": file?.type })
        .then((resp) => {
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [contractFile]
  );

  const onHandleAttachmentUpload = useCallback((value: any, index: any, hcpId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let payload = {
          file_name: value?.file?.name,
          file_type: value?.file?.type,
          attachment_type: value?.extraPayload?.file_type,
          expiry_date: value?.extraPayload?.expiry_date,
        };
        CommonService._api
          .post(ENV.API_URL + "hcp/" + hcpId + "/attachment", payload)
          .then((resp) => {
            if (value) {
              const file = value?.file;
              delete file.base64;
              CommonService._api
                .upload(resp.data, file, { "Content-Type": value?.file?.type })
                .then((resp) => {
                  console.log(resp);
                  resolve(resp);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const handleAttachmentsUpload = useCallback(
    async (hcpId: any, hcpResp: any) => {
      let promArray: any = [];

      required_attachments?.forEach((value: any, index: any) => {
        if (value?.index !== -1) {
          promArray.push(onHandleAttachmentUpload(fileUpload?.wrapper[value?.index], index, hcpId));
        }
      });

      console.log(promArray);

      if (promArray.length > 0) {
        Promise.all(promArray)
          .then((resp) => {
            console.log({ resp });
            history.push("/hcp/view/" + hcpId);
          })
          .catch((err) => console.log(err));
      } else {
        CommonService.showToast(hcpResp.msg || "Success", "success");
        history.push("/hcp/view/" + hcpId);
      }
    },
    [fileUpload?.wrapper, onHandleAttachmentUpload, history, required_attachments]
  );

  const handleContractUpload = useCallback(
    (hcpId: any) => {
      let payload = {
        file_name: contractFile?.wrapper[0]?.file?.name,
        file_type: contractFile?.wrapper[0]?.file?.type,
        attachment_type: "contract",
      };
      CommonService._api
        .post(ENV.API_URL + "hcp/" + hcpId + "/contract", payload)
        .then((resp) => {
          handleContractFileUpload(resp?.data);
        })
        .catch((err) => {
          console.log(err);
          CommonService.showToast(err, "error");
        });
    },
    [handleContractFileUpload, contractFile?.wrapper]
  );

  const OnContractFileUpload = (files: File[]) => {
    for (let file of files) {
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: "Data",
        uploadUrl: ENV.API_URL + "facility/add",
        allowed_types: ["jpg", "png", "csv", "pdf"],
        extraPayload: { expiry_date: "" },
      };
      const uploadWrapper = new TsFileUploadWrapperClass(uploadConfig, CommonService._api, (state: { wrapper: TsFileUploadWrapperClass }) => {
        setContractFile((prevState) => {
          if (prevState) {
            const index = prevState?.wrapper.findIndex((value: any) => value.uploadId === state.wrapper.uploadId);
            prevState.wrapper[index] = state.wrapper;
            return { wrapper: prevState.wrapper };
          }
          return prevState;
        });
      });
      uploadWrapper.onError = (err, heading) => {
        // console.error(err, heading);
        if (heading) {
          CommonService.showToast(err, "error");
        }
      };
      uploadWrapper.onSuccess = (resp) => {
        console.log(resp, "contract");
        if (resp && resp.success) {
          CommonService.showToast(resp.msg || resp.error, "success");
        }
      };
      uploadWrapper.onProgress = (progress) => {
        // console.log('progress', progress);
      };
      setContractFile((prevState) => {
        let state: TsFileUploadWrapperClass[] = [];
        if (prevState) {
          state = prevState?.wrapper;
        }
        const newState = [...state, uploadWrapper];
        return { wrapper: newState };
      });
      // uploadWrapper.startUpload();
    }
  };

  const deleteContractFile = (temp: any) => {
    let data = contractFile?.wrapper.filter((_: any, index: any) => index !== temp);
    setContractFile((prevState) => {
      return { wrapper: [...data] };
    });
  };

  const calculateExperience = (experiences: any[]) => {
    let expArr = experiences.map((item: any) => CommonService.getYearsDiff(item.start_date, item.end_date));
    let checkArrForNaNs = expArr.map(value => isNaN(value) ? 0 : value);
    const sum = checkArrForNaNs.reduce((partial_sum, a) => partial_sum + a, 0);
    return Math.round(sum * 10) / 10;
  };

  const handleCalcExperience = (exp: any) => {
    const res = calculateExperience(exp);
    setExpInYears(res);
  };

  const handleCalcSpecialities = (exp: any) => {
    let specialities = exp.map((item: any) => item?.specialisation);
    let filteredSpecs = specialities.filter((spec: any) => spec !== "None");
    setSpecialities(filteredSpecs);
  };

  const getHcpTypes = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
      setHcpTypes(resp.data || []);
      setHcpTypesLoading(false);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const openAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const confirmAdd = useCallback(() => {
    history.push("/hcp/list");
  }, [history]);

  useEffect(() => {
    Communications.pageTitleSubject.next("Add HCP");
    Communications.pageBackButtonSubject.next(null);
    getRegions();
    getSpecialities();
    getHcpTypes();
  }, [getRegions, getSpecialities, getHcpTypes]);

  if (specIsLoading || regIsLoading || hcpTypesLoading) {
    return <LoaderComponent />;
  }

  return (
    !specIsLoading &&
    !regIsLoading &&
    !hcpTypesLoading && (
      <>
        <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
          <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
        </DialogComponent>
        <DialogComponent open={isAddOpen} cancel={cancelAdd}>
          <LeavePageConfirmationComponent cancel={cancelAdd} confirm={confirmAdd} confirmationText={""} notext={"Cancel"} yestext={"Leave"} />
        </DialogComponent>
        <div className="add-hcp screen">
          <AddHcpBasicDetailsComponent
            contractFile={contractFile}
            fileUpload={fileUpload}
            setPreviewFile={setPreviewFile}
            setOpen={setOpen}
            onAdd={onAdd}
            hcpTypes={hcpTypes}
            regions={regions}
            specialities={specialities}
            expInYears={expInYears}
            required_attachments={required_attachments}
            setRequiredAttachments={setRequiredAttachments}
            OnContractFileUpload={OnContractFileUpload}
            deleteContractFile={deleteContractFile}
            setFileUpload={setFileUpload}
          />
          <div className="mrg-top-0 custom-border">
            <p className="card-header">Education</p>
            <EducationAddComponent educations={educations} setEducation={setEducations} />
          </div>
          <div className="mrg-top-0 custom-border">
            <p className="card-header">Work Experience</p>
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
            <p className="card-header">Volunteer Experience</p>
            <VolunteerExperienceAddComponent experiences={volunteerExperiences} setExperience={setVolunteerExperiences} />
          </div>
          <div className="mrg-top-0 custom-border">
            <p className="card-header">References</p>
            <ReferenceAddComponent references={references} setReference={setReferences} />
          </div>
          <div className="add-hcp-actions mrg-top-80">
            <Tooltip title={"Cancel"}>
              <Button size="large" onClick={openAdd} variant={"outlined"} color="primary" id="btn_hcp_add_cancel">
                {"Cancel"}
              </Button>
            </Tooltip>
            <Tooltip title={"Save Changes"}>
              <Button disabled={isHcpSubmitting} form="add-hcp-form" type="submit" id="btn_hcp_add_save" size="large" variant={"contained"} color={"primary"} className={isHcpSubmitting ? "has-loading-spinner" : ""}>
                {isHcpSubmitting ? "Saving" : "Save"}
              </Button>
            </Tooltip>
          </div>
          <ScrollToTop smooth color="white" />
        </div>
      </>
    )
  );
};

export default AddHcpComponent;
