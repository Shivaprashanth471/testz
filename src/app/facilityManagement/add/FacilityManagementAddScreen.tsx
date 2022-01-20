import { Button } from "@material-ui/core";
import { FormikHelpers } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import 'react-phone-number-input/style.css';
import { useHistory } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../classes/ts-file-upload-wrapper.class";
import DialogComponent from "../../../components/DialogComponent";
import LoaderComponent from "../../../components/LoaderComponent";
import CustomPreviewFile from "../../../components/shared/CustomPreviewFile";
import LeavePageConfirmationComponent from "../../../components/shared/LeavePageConfirmationComponent";
import { ENV } from "../../../constants";
import { americanTimeZone, otHours } from "../../../constants/data";
import { ApiService, CommonService, Communications } from "../../../helpers";
import FacilityAddDetailsComponent from "./BasicDetails/FacilityAddDetailsComponent";
import { FacilityItemAddType } from "./FacilityInitialAndValidationsComponent";
import "./FacilityManagementAddScreen.scss";
import FacilityAddComponent from "./FacilityMemberAddComponent/FacilityMemberAddComponent";
import ShiftAddComponent from "./ShiftAddComponent/ShiftAddComponent";


const FacilityManagementAddScreen = () => {
  const history = useHistory();
  const [members, setMembers] = useState<any[]>([]);
  const [shiftTimings, setShiftTimings] = useState<any[]>([]);
  const [regions, setRegions] = useState<any>([]);
  const [regIsLoading, setRegIsLoading] = useState<boolean>(true);
  const [isFacilitySubmitting, setIsFacilitySubmitting] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false)
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

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

  }, [shiftTimings]);


  const OnFileSelected = (files: File[]) => {
    for (let file of files) {
      // console.log(file)
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: 'image',
        uploadUrl: ENV.API_URL + 'facility/add',
        allowed_types: ['jpg', 'png', 'csv', 'pdf', 'jpeg'],
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
        // console.log(resp);
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

  const handleFacilityImageUpload = useCallback(async (link: any) => {
    const file = fileUpload?.wrapper[0]?.file;
    delete file.base64;
    CommonService._api.upload(link, file, { "Content-Type": file?.type }).then((resp) => {
      console.log(resp)
    }).catch((err) => {
      console.log(err)
    })
  }, [fileUpload?.wrapper])

  const handlegetUrlForUpload = useCallback((id: any) => {
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
  }, [handleFacilityImageUpload, fileUpload?.wrapper])


  const deleteFile = (temp: any) => {
    let data = fileUpload?.wrapper.filter((_: any, index: any) => index !== temp);
    setFileUpload(prevState => {
      return { wrapper: [...data] };
    })
  }

  const onAddShift = useCallback((shift: any, facilityId: string) => {
    console.log(shift);
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "facility/" + facilityId + "/shift", shift)
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

  const addShifts = useCallback((facilityId: string) => {
    (shiftTimings || []).forEach((value) => {
      onAddShift(value, facilityId);
    });
  }, [shiftTimings, onAddShift]);

  const onAddMember = useCallback((member: any, facilityId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "facility/" + facilityId + "/member", member).then((resp: any) => {
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

  const addMembers = useCallback((facilityId: string) => {
    (members || []).forEach((value) => {
      onAddMember(value, facilityId);
    });
  }, [members, onAddMember]);

  const onAdd = (facility: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<FacilityItemAddType>) => {
    setIsFacilitySubmitting(true)
    facility.phone_number = facility?.phone_number?.toLowerCase();
    facility.coordinates = [Number(facility?.longitude), Number(facility?.latitude)]
    ApiService.post(ENV.API_URL + "facility", facility)
      .then((resp: any) => {
        if (resp && resp.success) {
          const facilityId = resp.data._id;
          addMembers(facilityId);
          addShifts(facilityId);
          handlegetUrlForUpload(facilityId)
          CommonService.showToast(resp.msg || "Success", "success");
          history.push("/facility/view/" + facilityId)
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

  const getRegions = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "meta/hcp-regions")
      .then((resp) => {
        setRegions(resp.data || []);
        setRegIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setRegIsLoading(false);
      });
  }, []);

  const openAdd = useCallback(() => {
    setIsAddOpen(true)
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    history.push('/facility/list')
  }, [history])

  useEffect(() => {
    Communications.pageTitleSubject.next("Add Facility");
    Communications.pageBackButtonSubject.next(null);
    getRegions();
  }, [getRegions]);

  if (regIsLoading) {
    return <LoaderComponent />
  }
  return (
    !regIsLoading && <div className="facility-main  screen">
      <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
        <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
      </DialogComponent>
      <DialogComponent open={isAddOpen} cancel={cancelAdd}>
        <LeavePageConfirmationComponent cancel={cancelAdd} confirm={confirmAdd} confirmationText={''} notext={"Cancel"} yestext={"Leave"} />
      </DialogComponent>
      <div className="form-container mrg-top-30">
        <FacilityAddDetailsComponent onAdd={onAdd} regions={regions} americanTimeZone={americanTimeZone} fileUpload={fileUpload} previewFile={previewFile} deleteFile={deleteFile} OnFileSelected={OnFileSelected} otHours={otHours} />

        <div className="facility-members mrg-top-10  custom-border">
          <p className='card-header'>Facility Members</p>
          <div className="facility-add-component-container">
            <FacilityAddComponent members={members} setMembers={setMembers} />
          </div>
        </div>

        <div className="facility-shift-timings mrg-top-10  custom-border">
          <p className='card-header'>Shift Timings</p>
          <ShiftAddComponent
            setShiftTimings={setShiftTimings}
            shiftTimings={shiftTimings}
          />
        </div>
      </div>

      <div className="facility-actions mrg-top-60">
        <Button
          type="reset"
          size="large"
          variant={"outlined"}
          className={"normal"}
          color="primary"
          onClick={openAdd}
          id='btn_facility_add_cancel'
        >
          Cancel
        </Button>
        <Button
          disabled={isFacilitySubmitting}
          form="facility-add-form"
          type="submit"
          size="large"
          variant={"contained"}
          className="pdd-left-30 pdd-right-30"
          color={"primary"}
          id='btn_facility_add_submit'
        >
          {isFacilitySubmitting ? "Saving" : "Save"}
        </Button>
      </div>
      <ScrollToTop smooth color="white" />
    </div>
  );
};

export default FacilityManagementAddScreen;
