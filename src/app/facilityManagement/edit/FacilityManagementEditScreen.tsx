import React, { useCallback, useEffect, useState } from "react";
import { Button, CircularProgress} from "@material-ui/core";
import { FormikHelpers } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { ApiService, CommonService, Communications } from "../../../helpers";
import FacilityAddComponent from "./FacilityMemberEditComponent/FacilityMemberEditComponent";
import "./FacilityManagementEditScreen.scss";
import ShiftAddComponent from "./ShiftEditComponent/ShiftEditComponent";
import { ENV } from "../../../constants";
import 'react-phone-number-input/style.css';
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import ScrollToTop from "react-scroll-to-top";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import DialogComponent from "../../../components/DialogComponent";
import LeavePageConfirmationComponent from "../../../components/shared/LeavePageConfirmationComponent";
import {  FacilityItemEditType } from "./FacilityInitialAndValidationsComponent";
import FacilityEditDetailsComponent from "./BasicDetails/FacilityEditDetailsComponent";

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
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
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

  const openAdd = useCallback(() => {
    setIsAddOpen(true)
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    history.push(`/facility/view/${id}`)
  }, [id, history])

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

  const onAdd = (facility: FacilityItemEditType, { setSubmitting, setErrors, resetForm }: FormikHelpers<FacilityItemEditType>) => {
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
    Communications.pageBackButtonSubject.next(null);
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
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <LeavePageConfirmationComponent cancel={cancelAdd} confirm={confirmAdd} confirmationText={''} notext={"Cancel"} yestext={"Leave"} />
      </DialogComponent>
      <FacilityEditDetailsComponent onAdd={onAdd} regions={regions} isImageRemoved={isImageRemoved}
      facilityDetails={facilityDetails} deleteFacilityImage={deleteFacilityImage} previewFile={previewFile} 
      fileUpload={fileUpload} OnFileSelected={onFileSelected} deleteFile={deleteFile}/>

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
          onClick={openAdd}
          color="primary"
          id='btn_facility_edit_submit'
        >
          Cancel
        </Button>
        <Button
          disabled={facilitySubmitting}
          form="facility-edit-form"
          type="submit"
          size="large"
          variant={"contained"}
          color={"primary"}
          className={facilitySubmitting ? 'has-loading-spinner pdd-left-30 pdd-right-30' : 'pdd-left-30 pdd-right-30'}
          id='btn_facility_edit_submit'
        >
          {facilitySubmitting ? "Saving" : "Save"}
        </Button>
      </div>
      <ScrollToTop smooth color="white" />
    </div>
  ) : (
    <></>
  );
};

export default FacilityManagementEditScreen;
