import React, { useRef } from 'react';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import { Button } from "@material-ui/core";

export interface FileDropZoneComponentProps {
    OnFileSelected: (files: File[]) => void,
    allowedTypes: any
}

const FileDropZoneComponent = (props: FileDropZoneComponentProps) => {
    const { OnFileSelected, allowedTypes } = props;
    // console.log(OnFileSelected,allowedTypes)
    const inputFile = useRef<HTMLInputElement | null>();
    // const [isDragOver, setIsDragOver] = useState(false);

    // const handleFileSelect = (evt: any) => {
    //     evt.stopPropagation();
    //     evt.preventDefault();
    //     evt.dataTransfer.dropEffect = 'none';
    //     setIsDragOver(false);
    //     const files = evt.dataTransfer.files; // FileList object.
    //     filesSelected(files);
    // }

    const handleFileInputSelect = (e: any) => {
        const files = e.target.files; // FileList object.
        filesSelected(files);
        e.target.value = null;
    }

    const filesSelected = (files: any[]) => {
        files = Array.from(files);
        OnFileSelected(files);
    }

    // const handleDragLeave = (e: any) => {
    //     setIsDragOver(false);
    //     e.dataTransfer.dropEffect = 'none';
    // }

    // const handleDragOver = (e: any) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     setIsDragOver(true);
    //     e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    // }

    return (
        <>
            <div style={{ width: '110px', fontSize: '16px' }} className={"ts-file-drop-zone"}>
                <input id={'upload-btn'} ref={instance => inputFile.current = instance} type="file"
                    onChange={handleFileInputSelect} className="display-none" accept={allowedTypes} />
                <Button onClick={event => {
                    if (inputFile.current) inputFile.current.click();
                }} color="primary" className='icon'><div><CloudUploadOutlinedIcon style={{ fontSize: 55 }} /></div></Button>
            </div>
        </>
    )
};

export default FileDropZoneComponent;
