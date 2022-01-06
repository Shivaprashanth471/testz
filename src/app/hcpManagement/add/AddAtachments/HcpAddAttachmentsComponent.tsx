import React from 'react';
import NormalTextField from '@material-ui/core/TextField';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { TsFileUploadConfig, TsFileUploadWrapperClass } from '../../../../classes/ts-file-upload-wrapper.class';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import FileDropZoneComponent from '../../../../components/core/FileDropZoneComponent';

const HcpAddAttachmentsComponent = (props: any) => {
  const fileUpload = props?.fileUpload;
  const setFileUpload = props?.setFileUpload;
  const previewFile = props?.previewFile;
  const required_attachments = props?.required_attachments;
  const setRequiredAttachments = props?.setRequiredAttachments;

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
        extraPayload: { expiry_date: '', file_type: required_attachments[index]?.name }
      };
      const uploadWrapper = new TsFileUploadWrapperClass(uploadConfig, CommonService._api, (state: { wrapper: TsFileUploadWrapperClass }) => {
        // console.log(state);
        setFileUpload((prevState: any) => {
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
      setFileUpload((prevState: any) => {
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

  const deleteFile = (temp: any, itemIndex: any) => {
    console.log(temp, "deleteindex", itemIndex)
    let data = fileUpload?.wrapper.filter((_: any, index: any) => index !== itemIndex);
    console.log(data)
    if (required_attachments[temp]) {
      required_attachments[temp].index = -1
      setRequiredAttachments([...required_attachments])
    }
  }

  const handleExpiryDate = (event: any, index: any) => {
    setFileUpload((prevState: any) => {
      if (prevState) {
        prevState.wrapper[index].extraPayload.expiry_date = event.target.value;
      }
      return { wrapper: [...(prevState || { wrapper: [] }).wrapper] };
    })
  }

  return <div>
    <div className="attachments_wrapper">
      {required_attachments?.map((item: any, index: any) => {
        if (item.index !== -1) {
          return (<>
            <div className="attachments">
              <div className="custom_file mrg-top-0">
                <h3 className="mrg-top-20 mrg-bottom-0 file_name file_attachment_title"> {required_attachments[index].name}</h3>
                <div className="d-flex">
                  <div className="mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon" /></div>
                  <div className="file_details mrg-left-20 mrg-top-20">
                    <NormalTextField
                      required
                      label="Expires On"
                      type={"date"}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) => handleExpiryDate(event, required_attachments[index]?.index)}
                      value={fileUpload?.wrapper[required_attachments[index]?.index]?.extraPayload?.expiry_date}
                      disabled={index === 5}
                      inputProps={{
                        max: '2999-01-01'
                      }}
                    />
                    <div className="file_actions d-flex">
                      <p style={{ cursor: 'pointer' }} onClick={() => previewFile(item?.index, "attachment")} className="delete-image">View</p>
                      <p style={{ cursor: "pointer", width: "50px" }} className="mrg-left-30" onClick={() => deleteFile(index, item?.index)}>Delete</p>
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
              <div className="">
                <h3 className="attachement_name mrg-left-10 file_attachment_title">{item?.name}</h3>
                <FileDropZoneComponent
                  OnFileSelected={(item) => OnFileSelected(item, index)} allowedTypes={".pdf"}
                />
              </div>
            </div>
          )
        }
      })}
    </div>
  </div>;
}



export default HcpAddAttachmentsComponent;