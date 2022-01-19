import React, { useEffect, useState, useCallback } from 'react';
import { ENV } from '../../../../constants';
import { CommonService, Communications } from '../../../../helpers';
import { useParams } from "react-router-dom";
import moment from 'moment';
import { Button, CircularProgress, DialogActions } from "@material-ui/core";
// import StarBorderIcon from '@material-ui/icons/StarBorder';
import ShiftTimeline from '../../timeline/ShiftTimeline';
import DialogComponent from '../../../../components/DialogComponent';
import CustomPreviewFile from '../../../../components/shared/CustomPreviewFile';
import ShiftCheckInComponent from '../checkIn/ShiftCheckInComponent';
import ShiftBreaksComponent from '../breaks/ShiftBreaksComponent';
import ShiftCheckOutComponent from '../CheckOut/ShiftCheckOutComponent';
import { TsFileUploadConfig, TsFileUploadWrapperClass } from '../../../../classes/ts-file-upload-wrapper.class';
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';
import './ShiftMasterViewScreen.scss';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const ShiftMasterViewScreen = () => {
    const param = useParams<any>();
    const { id } = param;
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [basicDetails, setBasicDetails] = useState<any>(null);
    const [attachmentsList, seAttachmentsList] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [previewFileData, setPreviewFile] = useState<any | null>(null);
    const [checkInOpen, setcheckInOpen] = useState<boolean>(false);
    const [breaksOpen, setBreaksOpen] = useState<boolean>(false);
    const [checkOutOpen, setCheckOutOpen] = useState<boolean>(false);
    const [fileUpload, setFileUpload] = useState<{ wrapper: any } | null>(null);
    const [required_attachments, setRequiredAttachments] = useState<any>([{ name: "CDPH 530 A Form", index: -1 }]);
    const [isTimeSheetBeingUpdated, setIsTimeSheetBeingUpdated] = useState<boolean>(false);

    const previewFile = useCallback((index: any,type:any) => {
        if(type==="local"){
            setPreviewFile(fileUpload?.wrapper[0])
        }else{
        setPreviewFile(attachmentsList[index])
        }
        setOpen(true)
    }, [attachmentsList,fileUpload?.wrapper])

    const cancelPreviewFile = useCallback(() => {
        setOpen(false)
    }, [])
    const confirmPreviewFile = useCallback(() => {
        setOpen(false)
    }, [])

    const getShiftAttachments = useCallback(() => {
        CommonService._api.get(ENV.API_URL + 'shift/' + id + "/attachments").then((resp) => {
            seAttachmentsList(resp.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    const OnFileSelected = (files: File[], index: any) => {
        if (required_attachments[index]) {
            required_attachments[index].index = fileUpload?.wrapper?.length || 0
            setRequiredAttachments([...required_attachments])
        }
        for (let file of files) {
            // console.log(file)
            const uploadConfig: TsFileUploadConfig = {
                file: file,
                fileFieldName: 'Data',
                uploadUrl: ENV.API_URL + 'facility/add',
                allowed_types: ['jpg', 'png', 'csv', 'pdf'],
                extraPayload: { file_type: required_attachments[index]?.name }
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

    const getShiftDetails = useCallback(() => {
        setIsLoading(true)
        CommonService._api.get(ENV.API_URL + 'shift/' + id).then((resp) => {
            setBasicDetails(resp.data);
            setIsLoading(false);
            getShiftAttachments()
        }).catch((err) => {
            console.log(err)
        })
    }, [id, getShiftAttachments])

    const openTimeBreak = useCallback(() => {
        setcheckInOpen(true)
    }, [])

    const cancelCheckInOpen = useCallback(() => {
        setcheckInOpen(false)
    }, [])

    const confirmCheckInOpen = useCallback(() => {
        setcheckInOpen(false)
        getShiftDetails()
    }, [getShiftDetails])

    const openBreaks = useCallback(() => {
        setBreaksOpen(true)
    }, [])

    const cancelBreaksOpen = useCallback(() => {
        getShiftDetails()
        setBreaksOpen(false)
    }, [getShiftDetails])

    const confirmBreaksOpen = useCallback(() => {
        setBreaksOpen(false)
        getShiftDetails()
    }, [getShiftDetails])

    const openCheckOut = useCallback(() => {
        setCheckOutOpen(true)
    }, [])

    const cancelCheckOut = useCallback(() => {
        setCheckOutOpen(false)
    }, [])

    const confirmCheckOut = useCallback(() => {
        setCheckOutOpen(false)
        getShiftDetails()
    }, [getShiftDetails])

    const deleteFile = (temp: any) => {
        let data = fileUpload?.wrapper.filter((_: any, index: any) => index !== temp);
        if (required_attachments[temp]) {
            required_attachments[temp].index = -1
            setRequiredAttachments([...required_attachments])
        }
        setFileUpload(prevState => {
            return { wrapper: [...data] };
        })
    }

    const handleShiftStatus = useCallback(() => {
        const payload = {
            hcp_user_id: basicDetails?.hcp_user_id
        }
        CommonService._api.patch(ENV.API_URL + 'shift/' + id + '/closed', payload).then((resp) => {
            CommonService.showToast(resp?.msg || "Success", "success")
            getShiftAttachments()
            getShiftDetails()
        }).catch((err) => {
            console.log(err)
            CommonService.showToast(err || "Error", "error");
        })
    },[basicDetails?.hcp_user_id, id, getShiftAttachments,getShiftDetails])

    const handlegetUrlForUpload = useCallback(() => {
        setIsTimeSheetBeingUpdated(true)
        fileUpload?.wrapper?.forEach(async (value: any, index: any) => {
            let payload = {
                "file_name": value?.file?.name,
                "file_type": value?.file?.type,
                "attachment_type": value?.extraPayload?.file_type,
            }
            CommonService._api.post(ENV.API_URL + 'shift/' + id + '/attachment', payload).then((resp) => {
                if (fileUpload?.wrapper[index]) {
                    const file = fileUpload?.wrapper[index]?.file;
                    delete file.base64;
                    CommonService._api.upload(resp.data, file, { "Content-Type": value?.file?.type }).then((resp) => {
                        handleShiftStatus()
                        setIsTimeSheetBeingUpdated(false)
                    }).catch((err) => {
                        console.log(err)
                        setIsTimeSheetBeingUpdated(false)
                    })
                }
            }).catch((err) => {
                console.log(err)
                CommonService.showToast(err?.error || "Error", "error");
                setIsTimeSheetBeingUpdated(false)
            })
        })
    }, [fileUpload?.wrapper, id, handleShiftStatus])

    useEffect(() => {
        getShiftDetails()
        Communications.pageTitleSubject.next('Shifts Master');
        Communications.pageBackButtonSubject.next('/shiftMaster/list');
    }, [getShiftDetails])

    const { start_time, end_time } = CommonService.getUtcTimeInAMPM(basicDetails?.expected?.shift_start_time, basicDetails?.expected?.shift_end_time)
    const shift_date = CommonService.getUtcDate(basicDetails?.shift_date)

    return <div className="shift-completed-view screen crud-layout pdd-30">
        <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
            <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={previewFileData} />
        </DialogComponent>
        <DialogComponent open={checkInOpen} cancel={cancelCheckInOpen} >
            <ShiftCheckInComponent cancel={cancelCheckInOpen} confirm={confirmCheckInOpen} shiftDetails={basicDetails} />
        </DialogComponent>
        <DialogComponent open={breaksOpen} cancel={cancelBreaksOpen} >
            <ShiftBreaksComponent cancel={cancelBreaksOpen} confirm={confirmBreaksOpen} shiftDetails={basicDetails} />
        </DialogComponent>
        <DialogComponent open={checkOutOpen} cancel={cancelCheckOut} >
            <ShiftCheckOutComponent cancel={cancelCheckOut} confirm={confirmCheckOut} shiftDetails={basicDetails} />
        </DialogComponent>
        {isLoading && (
            <div className="view-loading-indicator">
                <CircularProgress color="secondary" className="loader" />
            </div>)}
        {!isLoading && (<>
            <div className='d-flex custom-border facility-details'>
                <div className='mrg-right-20'>
                    <h2>{basicDetails?.facility?.facility_name}</h2>
                    <p>{basicDetails?.facility?.address?.street},&nbsp;{basicDetails?.facility?.address?.region_name},&nbsp;{basicDetails?.facility?.address?.city},&nbsp;{basicDetails?.facility?.address?.country},&nbsp;{basicDetails?.facility?.address?.zip_code}.</p>
                </div>
                <div className='status-wrapper'>
                    <div className="d-flex">
                        <p className="status-details mrg-right-0">Status</p> <p className="status-details">&nbsp;:&nbsp;{basicDetails?.shift_status === "in_progress" ? "In Progress" : basicDetails?.shift_status}</p>
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
                        <h3>Required On</h3>
                        <p>{shift_date}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Time</h3>
                        <p> {start_time} &nbsp;-&nbsp;{end_time}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Shift Type</h3>
                        <p>{basicDetails?.shift_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Name</h3>
                        <p>{basicDetails?.hcp_user?.first_name} &nbsp; {basicDetails?.hcp_user?.last_name}</p>
                    </div>
                </div>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>HCP Email</h3>
                        <p>{basicDetails?.hcp_user?.email}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Type</h3>
                        <p>{basicDetails?.hcp_user?.hcp_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>Warning Zone</h3>
                        <p>{basicDetails?.warning_type}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP Differential Rate</h3>
                        <p>{basicDetails?.payments?.differential}</p>
                    </div>
                </div>
                <div className="d-flex shift-details">
                    <div className="flex-1">
                        <h3>HCP Hourly Rate</h3>
                        <p>{basicDetails?.payments?.hourly_hcp}</p>
                    </div>
                    <div className="flex-1">
                        <h3>HCP OT Hourly Rate</h3>
                        <p>{basicDetails?.payments?.hourly_ot}</p>
                    </div>
                    <div className="flex-1">

                    </div>
                    <div className="flex-1">

                    </div>
                </div>
            </div>
            <div className="header mrg-top-10 mrg-bottom-0">
                <div className="filter"></div>
                <div className="actions">
                    <Button variant={"contained"} onClick={openTimeBreak} color={"primary"} disabled={basicDetails?.shift_status === "cancelled"}>
                        CheckIn
                    </Button>
                    <Button variant={"contained"} onClick={openBreaks} color={"primary"} disabled={basicDetails?.shift_status === "cancelled" || basicDetails?.time_breakup?.check_in_time === ""}>
                        Break-In/Out
                    </Button>
                    <Button variant={"contained"} onClick={openCheckOut} color={"primary"} disabled={basicDetails?.shift_status === "cancelled" || basicDetails?.time_breakup?.check_in_time === ""}>
                        CheckOut
                    </Button>
                </div>
            </div>
            <div className="mrg-top-10 custom-border pdd-top-10">
                <div className="shift-name-requested">
                    <div className='d-flex'>
                        <h2 className='flex-1'>Shift Timings</h2>
                        <h4 className="hcp-rate">HCP Rate:<span className="mrg-left-10 ">{basicDetails?.hcp_user?.rate} $</span></h4>
                    </div>
                    <div className="d-flex shift-date-time ">
                        <div className="flex-1 flex-container" >
                            <h3>Attended On:</h3>
                            <p className="attended-date mrg-left-20">{basicDetails?.actuals?.shift_start_time ? moment(basicDetails?.actuals?.shift_start_time).format("MM-DD-YYYY") : "--"}</p>
                        </div>
                        <div className="flex-1 shift-duration flex-container">
                            <h3>Shift Duration:</h3>
                            <p className="shift-duration mrg-left-20">
                                {basicDetails?.time_breakup?.check_in_time && basicDetails?.time_breakup?.check_out_time && CommonService.durationFromHHMM(moment(basicDetails?.time_breakup?.check_in_time).format("HH:mm"), moment(basicDetails?.time_breakup?.check_out_time).format("HH:mm"))}
                            </p>
                        </div>
                        <div className="flex-1 flex-container shift-ot-time">
                            <h3>OT Hours:</h3>
                            <p className="attended-date mrg-left-20">--</p>
                        </div>

                    </div>
                    <div className="pdd-bottom-55">
                        <ShiftTimeline timeBreakup={basicDetails?.time_breakup} />
                    </div>
                </div>

                {/* <div className="feedback-rating-wrapper mrg-top-0">
                    <br />
                    <h3>Feedback:</h3>
                    <div className="d-flex">
                        {
                            [1, 2, 3, 4, 5]?.map((item: any, index: any) => {
                                return (
                                    <div className="mrg-right-15" key={index}><StarBorderIcon color={"primary"} /></div>
                                )
                            })
                        }
                    </div>
                    <div className="mrg-top-20">
                        <TextField
                            placeholder="Please write your review here.."
                            variant='outlined'
                            color={"primary"}
                            type={"text"}
                            name="shift_details"
                            disabled
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </div>
                </div> */}
            </div>
            <div className="mrg-top-10 custom-border pdd-top-10">
                <div className="mrg-top-20">
                    {attachmentsList?.length > 0 ? <>
                        <h3>Attachment:</h3>
                        <div className="d-flex" style={{ gap: "50px" }}>
                            {
                                attachmentsList?.map((item: any, index: any) => {
                                    return (
                                        <div className="attachments">
                                            <p className="mrg-left-10">{item?.attachment_type}</p>
                                            {<InsertDriveFileIcon color={"primary"} className="file-icon" onClick={() => previewFile(index,"api")} />}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </> : <>
                        <h3 className="mrg-top-0">Attachment:</h3>
                        <div className="d-flex" style={{ gap: "50px" }}>
                            {required_attachments?.map((item: any, index: any) => {
                                if (item.index !== -1) {
                                    return (<>
                                        <div className="attachments">
                                            <div className="custom_file mrg-top-0">
                                                <h3 className="mrg-top-20 mrg-bottom-0 file_name file_attachment_title"> {fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.file_type}</h3>
                                                <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                                            </div>
                                            <div className="d-flex file_actions">
                                                <p style={{ cursor: "pointer", width: "50px" }} className={"delete-cdhp mrg-top-0"} onClick={() => previewFile(index,"local")}>View</p>
                                                <p style={{ cursor: "pointer", width: "50px" }} className={"delete-cdhp mrg-top-0"} onClick={() => deleteFile(index)}>Delete</p>
                                            </div>
                                        </div>
                                    </>
                                    )
                                } else {
                                    return (
                                        <div className="attachments">
                                            <div className="">
                                                <h3 className="attachement_name file_attachment_title">{item?.name}</h3>
                                                <FileDropZoneComponent
                                                    OnFileSelected={(item) => OnFileSelected(item, index)} allowedTypes={".pdf"}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </>}
                </div>
                <DialogActions className="mrg-top-35">
                    {
                        basicDetails?.shift_status === "complete" &&
                        <Button
                            type={"submit"}
                            className={"submit"}
                            variant={"contained"}
                            color="primary"
                            autoFocus
                            disabled={fileUpload?.wrapper?.length<=0 || isTimeSheetBeingUpdated }
                            onClick={handlegetUrlForUpload}>
                            {isTimeSheetBeingUpdated ? 'Saving' : 'Save'}
                        </Button>
                    }
                </DialogActions>
            </div>
        </>)}

    </div>
}


export default ShiftMasterViewScreen;