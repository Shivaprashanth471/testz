import { Avatar, Button, Checkbox, Tooltip } from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { Rating } from "@material-ui/lab";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { TsFileUploadConfig, TsFileUploadWrapperClass } from "../../../../classes/ts-file-upload-wrapper.class";
import FileDropZoneComponent from "../../../../components/core/FileDropZoneComponent";
import DialogComponent from "../../../../components/DialogComponent";
import LoaderComponent from "../../../../components/LoaderComponent";
import CustomPreviewFile from "../../../../components/shared/CustomPreviewFile";
import { ENV } from "../../../../constants";
import { ApiService, CommonService, Communications } from "../../../../helpers";
import ShiftTimeline from "../../timeline/ShiftTimeline";
import "./ShiftCompletedViewScreen.scss";

const ShiftCompletedViewScreen = () => {
  const param = useParams<any>();
  const { id } = param;
  const [basicDetails, setBasicDetails] = useState<any>(null);
  const [isFacilityConfirm, setIsFacilityConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataSubmitting, setIsDataSubmitting] = useState<boolean>(false);
  const [isTimeSheetBeingUpdated, setIsTimeSheetBeingUpdated] = useState<boolean>(false);

  const [attachmentsList, seAttachmentsList] = useState<any>(null);
  const [previewFileData, setPreviewFile] = useState<any | null>(null);
  const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
  const [required_attachments, setRequiredAttachments] = useState<any>([{ name: "CDPH 530 A Form", index: -1 }]);
  const [downloadAttachmentsList, downloadSeAttachmentsList] = useState<any | null>(null);
  const [hcpRating, setHcpRating] = useState<number | null>(null)
  const [open, setOpen] = useState<boolean>(false);
  const history = useHistory();

  const previewFile = useCallback(
    (index: any, type: any) => {
      if (type === "local") {
        setPreviewFile(fileUpload?.wrapper[0]);
      } else {
        setPreviewFile(attachmentsList[index]);
      }
      setOpen(true);
    },
    [attachmentsList, fileUpload?.wrapper]
  );

  const getShiftAttachmentsDownload = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "shift/" + id + "/attachments")
      .then((resp) => {
        downloadSeAttachmentsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const cancelPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);
  const confirmPreviewFile = useCallback(() => {
    setOpen(false);
  }, []);

  const getShiftAttachments = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "shift/" + id + "/attachments?is_preview=true")
      .then((resp) => {
        seAttachmentsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const OnFileSelected = (files: File[], index: any) => {
    if (required_attachments[index]) {
      required_attachments[index].index = fileUpload?.wrapper?.length || 0;
      setRequiredAttachments([...required_attachments]);
    }
    for (let file of files) {
      // console.log(file)
      const uploadConfig: TsFileUploadConfig = {
        file: file,
        fileFieldName: "Data",
        uploadUrl: ENV.API_URL + "facility/add",
        allowed_types: ["jpg", "png", "csv", "pdf", "jpeg"],
        extraPayload: { file_type: required_attachments[index]?.name },
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
        });
      });
      uploadWrapper.onError = (err, heading) => {
        // console.error(err, heading);
        if (heading) {
          CommonService.showToast(err, "error");
        }
      };
      uploadWrapper.onSuccess = (resp) => {
        console.log(resp);
        if (resp && resp.success) {
          CommonService.showToast(resp.msg || resp.error, "success");
        }
      };
      uploadWrapper.onProgress = (progress) => { };
      setFileUpload((prevState) => {
        let state: TsFileUploadWrapperClass[] = [];
        if (prevState) {
          state = prevState?.wrapper;
        }
        const newState = [...state, uploadWrapper];
        return { wrapper: newState };
      });
    }
  };

  const deleteFile = (temp: any) => {
    let data = fileUpload?.wrapper.filter((_: any, index: any) => index !== temp);
    if (required_attachments[temp]) {
      required_attachments[temp].index = -1;
      setRequiredAttachments([...required_attachments]);
    }
    setFileUpload((prevState) => {
      return { wrapper: [...data] };
    });
  };




  const handleFacilityConfirmation = (e: any) => {
    setIsFacilityConfirm(e.target.checked);
  };

  const handleSubmit = async () => {
    await handleConfirmationFromFacility()
    await handleGetUrlForUpload()
    history.push(`/completedShifts/list`)
  };

  const getShiftDetails = useCallback(() => {
    CommonService._api
      .get(ENV.API_URL + "shift/" + id)
      .then((resp) => {
        setBasicDetails(resp.data);
        setIsFacilityConfirm(resp.data?.is_facility_approved)
        setHcpRating(resp.data?.hcp_rating)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);


  const handleConfirmationFromFacility = useCallback(() => {
    setIsDataSubmitting(true);
    return new Promise((resolve, reject) => {
      ApiService.put(ENV.API_URL + "shift/" + id, {
        is_facility_approved: isFacilityConfirm,
        hcp_rating: hcpRating,
      })
        .then((res: any) => {
          setIsDataSubmitting(false);
          CommonService.showToast(res?.msg, "success");
          resolve(null)
        })
        .catch((err) => {
          console.log(err);
          setIsDataSubmitting(false);
          reject(err)
          CommonService.showToast(err?.msg, "error");
        });
    })
  }, [id, isFacilityConfirm, hcpRating])


  const handleGetUrlForUpload = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (fileUpload?.wrapper.length > 0) {
        fileUpload?.wrapper?.forEach(async (value: any, index: any) => {
          let payload = {
            file_name: value?.file?.name,
            file_type: value?.file?.type,
            attachment_type: value?.extraPayload?.file_type,
          };
          setIsTimeSheetBeingUpdated(true);
          CommonService._api
            .post(ENV.API_URL + "shift/" + id + "/attachment", payload)
            .then((resp) => {
              if (fileUpload?.wrapper[index]) {
                const file = fileUpload?.wrapper[index]?.file;
                delete file.base64;
                CommonService._api
                  .upload(resp.data, file, { "Content-Type": value?.file?.type })
                  .then((resp) => {
                    setIsTimeSheetBeingUpdated(false);
                    CommonService.showToast(resp?.msg || "attachment uploaded", 'success')
                    resolve(null)
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsTimeSheetBeingUpdated(false);
                    reject(err)
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              CommonService.showToast(err?.error || "Error", "error");
              setIsTimeSheetBeingUpdated(false);
            });
        });
      } else {
        resolve(null)
      }
    })
  }, [fileUpload?.wrapper, id]);


  useEffect(() => {
    getShiftDetails();
    getShiftAttachments();
    getShiftAttachmentsDownload();
  }, [getShiftDetails, getShiftAttachments, getShiftAttachmentsDownload]);

  useEffect(() => {
    Communications.pageTitleSubject.next("Shifts Completed");
    Communications.pageBackButtonSubject.next("/completedShifts/list");
  }, []);

  const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.expected?.shift_start_time, basicDetails?.expected?.shift_end_time);
  const shift_date = CommonService.getUtcDate(basicDetails?.shift_date);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="shift-completed-view screen crud-layout pdd-30">
      <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
        <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
      </DialogComponent>

      {!isLoading && (
        <>
          <div className="pdd-0 custom-border">
            <div className="d-flex pdd-20 hcp-photo-details-wrapper">
              <div className="d-flex">
                <div className="flex-1">
                  <Avatar style={{ height: "80px", width: "80px" }}>{basicDetails?.hcp_user?.first_name?.toUpperCase().charAt("0")}</Avatar>
                </div>
                <div className="hcp-name-type">
                  <h2>
                    {basicDetails?.hcp_user?.first_name}&nbsp;{basicDetails?.hcp_user?.last_name}
                  </h2>
                  <p>{basicDetails?.hcp_user?.hcp_type}</p>
                </div>
              </div>
            </div>
            <div className="d-flex hcp-details pdd-bottom-20 custom-border " style={{ gap: "20px" }}>
              <div className="flex-1">
                <h4>Years Of Experience</h4>
                <p>{basicDetails?.hcp_user?.experience ? basicDetails?.hcp_user?.experience + " Years" : "N/A"}</p>
              </div>
              <div className="flex-1">
                <h4>Contact Number</h4>
                <p>{basicDetails?.hcp_user?.contact_number}</p>
              </div>
              <div className="flex-1">
                <h4>Address</h4>
                <p>
                  {basicDetails?.hcp_user?.address?.region},&nbsp;{basicDetails?.hcp_user?.address?.city},&nbsp;{basicDetails?.hcp_user?.address?.state},&nbsp;{basicDetails?.hcp_user?.address?.country},&nbsp;
                  {basicDetails?.hcp_user?.address?.zip_code}&nbsp;&nbsp;
                </p>
              </div>
              <div className="flex-1">
                <h4>Email</h4>
                <p>{basicDetails?.hcp_user?.email}</p>
              </div>
              <div className="flex-1">
                <h4>HCP Rate (hr)</h4>
                <p>{basicDetails?.hcp_user?.rate} $</p>
              </div>
            </div>
          </div>
          <div className="d-flex facility-details mrg-top-10 custom-border pdd-bottom-0">
            <div className="flex-1">
              <h2>{basicDetails?.facility?.facility_name}</h2>
              <p>
                {basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;
                {basicDetails?.facility?.address?.zip_code}.
              </p>
            </div>
            <div className="flex-1 actions-wrapper">
              <div className="button">
                <Tooltip title={`View ${basicDetails?.facility?.facility_name} Details`}>
                  <Button component={Link} color={"primary"} variant={"outlined"} to={{ pathname: "/facility/view/" + basicDetails?.facility?._id, state: { prevPath: "/completedShifts/view/" + id } }}>
                    View Details
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="facility-details mrg-top-10 custom-border">
            <div className="d-flex shift-name-requested">
              <h2>Shift Details</h2>
              <div className="d-flex requested-on-wrapper">
                <h3>Created On:</h3>
                <p className="mrg-left-10">{moment(basicDetails?.created_at).format("MM-DD-YYYY")}</p>
              </div>
            </div>
            <p>{basicDetails?.title}</p>
            <div className="d-flex shift-details">
              <div className="flex-1">
                <h3>Required On:</h3>
                <p>{shift_date}</p>
              </div>
              <div className="flex-1">
                <h3>Time</h3>
                <p>
                  {start_time} &nbsp;-&nbsp;{end_time}
                </p>
              </div>
              <div className="flex-1">
                <h3>Time Type:</h3>
                <p>{basicDetails?.shift_type}</p>
              </div>
              <div className="flex-1">
                <h3>Warning Zone</h3>
                <p>{basicDetails?.warning_type}</p>
              </div>
            </div>
            <div className="d-flex shift-details">
              <div className="flex-1">
                <h3>HCP Differential Rate</h3>
                <p>{basicDetails?.payments?.differential}</p>
              </div>
              <div className="flex-1">
                <h3>HCP OT Hourly Rate</h3>
                <p>{basicDetails?.facility?.conditional_rates?.overtime?.rate}</p>
              </div>
              <div className="flex-1"></div>
              <div className="flex-1"></div>
            </div>
          </div>


          <div className="mrg-top-10 custom-border pdd-top-10">
            <div className="shift-name-requested">
              <div className="d-flex">
                <h2 className="flex-1">Shift Timings</h2>
                <h4 className="hcp-rate">
                  HCP Rate:<span className="mrg-left-10 ">{basicDetails?.hcp_user?.rate} $</span>
                </h4>
              </div>
              <div className="d-flex shift-date-time">
                <div className="d-flex flex-1 flex-baseline">
                  <h3>Attended On:</h3>
                  <p className="attended-date mrg-left-15">{moment(basicDetails?.actuals?.shift_start_time).format("MM-DD-YYYY")}</p>
                </div>

                <div className="d-flex flex-1 flex-center">
                  <h3 className="hcp-rating mrg-left-15">HCP Rating &nbsp;</h3>
                  <Rating
                    color='primary'
                    name="hcp-rating"
                    value={hcpRating}
                    onChange={(event, newValue) => {
                      setHcpRating(newValue);
                    }}
                  />
                </div>
                <div className=" d-flex flex-1 flex-center">
                  <h3 className="attended-date mrg-left-15">Facility Confirmation</h3>
                  <Checkbox checked={isFacilityConfirm} onChange={handleFacilityConfirmation} />
                </div>
              </div>
              <div className="pdd-bottom-45">
                <ShiftTimeline timeBreakup={basicDetails?.time_breakup} />
              </div>
            </div>
          </div>
        </>
      )}
      {basicDetails?.shift_status === "complete" || basicDetails?.shift_status === "closed" ? (
        <div className="mrg-top-10 custom-border pdd-top-10">
          <div className="mrg-top-20">
            {attachmentsList?.length > 0 ? (
              <>
                <h3>Attachment:</h3>
                <div className="d-flex" style={{ gap: "50px" }}>
                  {attachmentsList?.map((item: any, index: any) => {
                    return (
                      <div className="attachments">
                        <div>
                          <p className="">{item?.attachment_type}</p>
                          <Tooltip title="Preview CDPH 530 A Form">{<InsertDriveFileIcon color={"primary"} className="file-icon" onClick={() => previewFile(index, "api")} style={{ cursor: "pointer" }} />}</Tooltip>
                        </div>
                        <div className="d-flex">
                          <Tooltip title="Download CDPH 530 A Form">
                            <p onClick={() => previewFile(index, "api")} className="file-actions">
                              Preview
                            </p>
                          </Tooltip>
                          <Tooltip title="Download CDPH 530 A Form">
                            <a download href={downloadAttachmentsList[index]?.url} className="file-actions mrg-left-10">
                              Download
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {basicDetails?.shift_status === "complete" && (
                  <>
                    <h3 className="mrg-top-0">Attachment:</h3>
                    <div className="d-flex" style={{ gap: "50px" }}>
                      {required_attachments?.map((item: any, index: any) => {
                        if (item.index !== -1) {
                          return (
                            <>
                              <div className="attachments">
                                <div className="custom_file mrg-top-0">
                                  <h3 className="mrg-top-20 mrg-bottom-0 file_name file_attachment_title"> {fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.file_type}</h3>
                                  <div className="mrg-top-15">
                                    <InsertDriveFileIcon color={"primary"} className="file-icon" />
                                  </div>
                                </div>
                                <div className="d-flex file_actions">
                                  <Tooltip title={`View ${fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.file_type}`}>
                                    <p style={{ cursor: "pointer", width: "50px" }} className={"delete-cdhp mrg-top-0"} onClick={() => previewFile(index, "local")}>
                                      View
                                    </p>
                                  </Tooltip>
                                  <Tooltip title={`Delete ${fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.file_type}`}>
                                    <p style={{ cursor: "pointer", width: "50px" }} className={"delete-cdhp mrg-top-0"} onClick={() => deleteFile(index)}>
                                      Delete
                                    </p>
                                  </Tooltip>
                                </div>
                              </div>
                            </>
                          );
                        } else {
                          return (
                            <div className="attachments">
                              <div className="">
                                <h3 className="attachement_name file_attachment_title">{item?.name}</h3>
                                <Tooltip title={`Upload ${item?.name}`}>
                                  <div>
                                    <FileDropZoneComponent OnFileSelected={(item) => OnFileSelected(item, index)} allowedTypes={".pdf"} />
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}

      {
        basicDetails?.shift_status === 'complete' && <div className="shift-view-actions mrg-top-20">
          <Tooltip title={"Cancel"}>
            <Button size="large" onClick={() => history.push(`/completedShifts/list`)} variant={"outlined"} color="primary" id="btn_cancel">
              {"Cancel"}
            </Button>
          </Tooltip>
          <Tooltip title={"Save Changes"}>
            <Button disabled={isDataSubmitting || isTimeSheetBeingUpdated} type="submit" id="btn_save" size="large" variant={"contained"} color={"primary"} className={isDataSubmitting || isTimeSheetBeingUpdated ? "has-loading-spinner" : ""} onClick={handleSubmit}>
              {isDataSubmitting || isTimeSheetBeingUpdated ? "Saving" : "Save"}
            </Button>
          </Tooltip>
        </div>
      }
    </div>
  );
};

export default ShiftCompletedViewScreen;
