import React, { useCallback } from 'react';
import DialogComponent from '../DialogComponent';
import CustomPreviewFile from './CustomPreviewFile';
import moment from 'moment';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

interface CustomFileProps {
    data?: any,
    download?: boolean
    handleDelete?: any,
}

const CustomFile = (props: CustomFileProps) => {
    console.log(props?.data)
    const [open, setOpen] = React.useState(false);
    const previewFile = useCallback(() => {
        setOpen(true)
    }, [])
    const cancelPreviewFile = useCallback(() => {
        setOpen(false)
    }, [])
    const confirmPreviewFile = useCallback(() => {
        setOpen(false)
    }, [])
    
    return <div className="custom_file">
        <DialogComponent open={open} cancel={cancelPreviewFile} class="preview-content">
            <CustomPreviewFile cancel={cancelPreviewFile} confirm={confirmPreviewFile} previewData={props?.data} />
        </DialogComponent>
        <h3 className="mrg-top-10 mrg-bottom-0 file_name">{props?.data?.attachment_type}</h3>
        <div className="d-flex">
            <div className="mrg-left-0 mrg-top-15"><InsertDriveFileIcon color={"primary"} className="file-icon"/></div>
            <div className="file_details mrg-left-20 mrg-top-15">
                {props?.data?.expiry_date?<>
                <p className="mrg-top-10 mrg-bottom-0">Date:</p>
                <p className="mrg-top-5 mrg-bottom-0">{props?.data?.expiry_date?moment(props?.data?.expiry_date).format("MM-DD-YYYY"):"N/A"}</p>
                </>:<></>}<div className={props?.data?.expiry_date?"d-flex mrg-top-0 file_actions":"mrg-top-20 file_actions"}>
                    <p onClick={previewFile} style={{ cursor: 'pointer' }} className="preview-file">Preview</p>
                    <a href={props?.data?.url}  download className={props?.data?.expiry_date?"mrg-left-20 download-link":"download-link"} style={{ cursor: 'pointer' }}>Download</a>
                </div>
            </div>
        </div>
    </div>;
}

export default CustomFile;