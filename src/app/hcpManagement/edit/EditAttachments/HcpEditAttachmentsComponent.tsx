import React, { PropsWithChildren } from "react";
import NormalTextField from "@material-ui/core/TextField";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import FileDropZoneComponent from "../../../../components/core/FileDropZoneComponent";

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

  function RenderSortedAttachments() {
    let filteredData = required_attachments?.filter((item: any) => !attachmentsDetails?.some((item2: any) => item?.attachment_type === item2?.attachment_type));

    return filteredData.map((item: any, index: any) => {
      if (item.index !== -1) {
        return (
          <>
            <div key={item?.id} className="attachments mrg-top-15">
              <br />
              <div className="custom_file">
                <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
                <div className="d-flex">
                  <div className="mrg-top-15">
                    <InsertDriveFileIcon color={"primary"} className="file-icon" />
                  </div>
                  <div className="file_details mrg-left-20 mrg-top-20">
                    <NormalTextField
                      inputProps={{
                        max: "2999-01-01",
                      }}
                      required
                      label="Expires On:"
                      type={"date"}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) => handleExpiryDate(event, item?.index)}
                      value={fileUpload?.wrapper[item?.index]?.extraPayload?.expiry_date}
                      disabled={item?.attachment_type === "SSN Card"}
                    />
                    <div className="file_actions d-flex">
                      <button style={{ cursor: "pointer" }} onClick={() => previewFile(item?.index, "attachment")} className="delete-button mrg-top-15">
                        View
                      </button>
                      <button style={{ cursor: "pointer", width: "50px" }} disabled={isDeleted} className="delete-button mrg-left-20 mrg-top-15" onClick={() => deleteLocalAttachment(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <div className="attachments">
            <div className="mrg-top-40">
              <h3 className="attachement_name mrg-left-10 file_attachment_title">{item?.attachment_type}</h3>
              <FileDropZoneComponent allowedTypes={".pdf"} OnFileSelected={(item1) => OnFileSelected(item1, item?.id)} />
            </div>
          </div>
        );
      }
    });
  }

  function RenderAvailableAttachments() {
    return attachmentsDetails?.map((item: any, index: any) => {
      return (
        <div key={index} className="attachments">
          <div className="custom_file">
            <h3 className="mrg-top-10 mrg-bottom-0 file_name file_attachment_title"> {item.attachment_type}</h3>
            <div className="d-flex">
              <div className="mrg-top-15">
                <InsertDriveFileIcon color={"primary"} className="file-icon" />
              </div>
              <div className="file_details mrg-left-20 mrg-top-20">
                <NormalTextField
                  label="Expires On"
                  type={"date"}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                  disabled
                  inputProps={{
                    max: "2999-01-01",
                  }}
                  value={item.expiry_date}
                />
                <div className="file_actions">
                  <button style={{ cursor: "pointer", width: "50px" }} className="delete-button mrg-top-15" disabled={isDeleted} onClick={(e) => openDeleteAttachment(e, item)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <div className="attachments_wrapper">
      {RenderAvailableAttachments()}
      {RenderSortedAttachments()}
    </div>
  );
};

export default HcpEditAttachmentsComponent;
