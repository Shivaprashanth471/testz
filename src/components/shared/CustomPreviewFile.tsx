import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// Worker
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        margin: "auto",
        justifyContent: "center",
        textAlign: "center"
    },
    downloadButton: {
        color: "white",
        textDecoration: "none"
    },
    nopreview: {
        fontSize: "22px"
    }
}));
const CustomPreviewFile = (props: any) => {
    let url = props?.previewData?.url || props?.previewData?.file?.base64 || props?.previewData;
    let type = props?.previewData?.ContentType || props?.previewData?.file?.type || 'image/jpeg';

    const classes = useStyles();
    const handleDownload=()=>{
        // alert("ghjk")
        // const blob = new Blob([url], {
        //     type: 'image/jpeg' // must match the Accept type
        // });
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        // link.download = props?.previewData?.file_name;
        // link.click();
    }
    return (
        <div className={classes.paper} >
            <div className="preview-component">
                {(() => {
                    if (type === "application/pdf") {
                        return (<div className='pdf-wrapper'>
                            <iframe title="iframe-preview"
                                src={url} height={"600px"} width="1000px" />
                        </div>)
                    } else if (type ==="image/jpeg" || "image/jpg" || "image/png") {
                        return (
                            <div className={'no-repeat-background main-profile-pic'} style={{backgroundImage: 'url('+url+')'}}></div>
                        )
                    } else {
                        return (
                            <>
                                <p className={classes.nopreview}>No preview available</p>
                                <Button variant={"contained"} color="secondary" id="btn_download_preview">
                                    <p onClick={handleDownload} className={classes.downloadButton}>Download</p>
                                </Button>
                            </>
                        )
                    }
                })()}
            </div>
        </div>
    );
};

export default CustomPreviewFile;
