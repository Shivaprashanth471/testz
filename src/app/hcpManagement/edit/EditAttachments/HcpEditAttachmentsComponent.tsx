import React, { PropsWithChildren, useEffect, useState } from "react";
import NormalTextField from '@material-ui/core/TextField';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DoneIcon from '@material-ui/icons/Done';
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';
import { Tooltip } from "@material-ui/core";

export interface HcpEditAttachmentsComponentProps {
    fileUpload: any;
    required_attachments: any;
    isDeleted: any;
    OnFileSelected: any;
    attachmentsDetails: any;
    previewFile: any;
    handleExpiryDate: any;
    deleteLocalAttachment: any;
    openDeleteAttachment: any;
    setRequiredAttachments: any;
    setFileUpload: any;
}

const HcpEditAttachmentsComponent = (props: PropsWithChildren<HcpEditAttachmentsComponentProps>) => {
    const attachmentsDetails = props?.attachmentsDetails;
    const required_attachments = props?.required_attachments;
    const handleExpiryDate = props?.handleExpiryDate;
    const fileUpload = props?.fileUpload;
    const previewFile = props?.previewFile;
    const isDeleted = props?.isDeleted;
    const OnFileSelected = props?.OnFileSelected;
    const deleteLocalAttachment = props?.deleteLocalAttachment;
    const openDeleteAttachment = props?.openDeleteAttachment;
    const setRequiredAttachments = props?.setRequiredAttachments;
    const setFileUpload = props?.setFileUpload;
    const [additionalCount, setAdditionalCount] = useState<any>(0)
    const handleAttachmentName = (index: any, RequiredAttachmentsIndex: any) => {
        let temp = required_attachments[index - 1];
        temp.attachment_type = fileUpload?.wrapper[RequiredAttachmentsIndex]?.extraPayload?.expiry_date;
        setFileUpload((prevState: any) => {
            if (prevState) {
                prevState.wrapper[RequiredAttachmentsIndex].extraPayload.file_type = prevState.wrapper[RequiredAttachmentsIndex].extraPayload.expiry_date;
            }
            return { wrapper: [...(prevState || { wrapper: [] }).wrapper] };
        })
    }

    useEffect(() => {
        let count = attachmentsDetails?.length;
        required_attachments?.forEach((item: any) => {
            attachmentsDetails?.forEach((attachment: any) => {
                if (item.attachment_type === attachment?.attachment_type) {
                    count--;
                }
            });
        });

        setAdditionalCount(count)
        console.log(required_attachments?.length, count)
        for (let i = 0; i < 3 - count; i++) {
            if (required_attachments?.length + count <= 15) {
                required_attachments.push({ attachment_type: "Additional Attachment", index: -1, id: required_attachments?.length + 1 })
            }
        }
        setRequiredAttachments([...required_attachments])
        // eslint-disable-next-line
    }, [attachmentsDetails])

    console.log(additionalCount)

    function RenderSortedAttachments() {
        let filteredData = required_attachments?.filter((item: any) => !attachmentsDetails?.some((item2: any) => item?.attachment_type === item2?.attachment_type))

        return filteredData.map((item: any, index: any) => {
            if (item.index !== -1) {
                return (<>
                    <div key={"render-sorted-attachments-" + item?.id} className="attachments mrg-top-15">
                        <br />
                        <div className="custom_file">
                            <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
                            <div className="d-flex">
                                <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                                <div className="file_details mrg-left-0 mrg-top-20">
                                    {item?.id < required_attachments?.length - 2 + additionalCount ?
                                        item?.attachment_type === "Resume" || item?.attachment_type === "SSN Card" || item?.attachment_type === "Covid Vaccine Card" || item?.attachment_type === "Vaccine Exemption Letter" ? <div></div> :
                                            <NormalTextField
                                                inputProps={{
                                                    max: '2999-01-01'
                                                }}
                                                required
                                                label="Expires On:"
                                                type={"date"}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={(event) => handleExpiryDate(event, item?.index)}
                                                value={fileUpload?.wrapper[item?.index]?.extraPayload?.expiry_date}
                                            /> :
                                        <div className='d-flex'>
                                            <NormalTextField
                                                required
                                                label="Attachment Name"
                                                type={"text"}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={(event) => handleExpiryDate(event, item?.index)}
                                                value={fileUpload?.wrapper[item?.index]?.extraPayload?.expiry_date}
                                            />
                                            <div className='mrg-top-15 mrg-left-0 done-tick'>
                                            <Tooltip title={`Save Attachment Name`}>
                                                <DoneIcon color='primary' onClick={() => handleAttachmentName(item?.id, item?.index)} />
                                          </Tooltip>
                                            </div>
                                        </div>}

                                    <div className={item?.attachment_type === "Resume" || item?.attachment_type === "SSN Card" || item?.attachment_type === "Covid Vaccine Card" || item?.attachment_type === "Vaccine Exemption Letter" ? "display-inline" : "file_actions d-flex"}>
                                        <Tooltip title={`View ${item?.attachment_type}`}>
                                            <button style={{ cursor: 'pointer' }} onClick={() => previewFile(item?.index, "attachment")} className="delete-button mrg-top-15">View</button>
                                        </Tooltip>
                                        <Tooltip title={`Delete ${item?.attachment_type}`}>
                                            <button style={{ cursor: "pointer", width: '50px' }} disabled={isDeleted} className="delete-button  mrg-top-15" onClick={() => deleteLocalAttachment(item?.id)}>Delete</button>
                                        </Tooltip>
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
                            <Tooltip title={`Upload ${item?.attachment_type}`}>
                                <div>
                                    <FileDropZoneComponent allowedTypes={".pdf"}
                                        OnFileSelected={(item1) => OnFileSelected(item1, item?.id)}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                )
            }
        })
    }




    function RenderAvailableAttachments() {
        return attachmentsDetails?.map((item: any, index: any) => {
            return (
                <div key={"render-available-attachments" + index} className="attachments">
                    <div className="custom_file">
                        <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
                        <div className="d-flex">
                            <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                            <div className="file_details mrg-left-0 mrg-top-20">
                                {item?.expiry_date? 
                                    <NormalTextField
                                        label="Expires On"
                                        type={"date"}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                                        disabled
                                        inputProps={{
                                            max: '2999-01-01'
                                        }}
                                        value={item.expiry_date}
                                    />:<div></div> }
                                <div className="file_actions">
                                    <Tooltip title={`Delete ${item.attachment_type}`}>
                                        <button style={{ cursor: "pointer", width: '50px' }} className="delete-button mrg-top-15" disabled={isDeleted} onClick={(e) => openDeleteAttachment(e, item)}>Delete</button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        })
    }
    return <div className="attachments_wrapper">
        {RenderAvailableAttachments()}
        {RenderSortedAttachments()}
    </div>;
}

export default HcpEditAttachmentsComponent;


