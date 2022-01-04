import {ApiService, CommonService} from "../helpers";
import {CancelTokenSource} from "axios";

export interface TsFileUploadConfig {
    file?: File;
    files?: File[];
    allowed_types?: string[];
    generatePreview?: boolean;
    extraPayload?: object;
    uploadUrl: string;
    fileFieldName: string;
}

export class TsFileUploadWrapperClass {
    file?: File | any;
    files?: File[] | any[];
    protected allowed_types: string[] = ['gif', 'png', 'jpg', 'jpeg'];
    protected generatePreview = true;
    protected uploadUrl = '';
    protected fileFieldName = 'file';
    protected extraPayload: any = {};

    cancelToken: CancelTokenSource = CommonService.getCancelToken();
    uploadText = 'Starting';
    uploadProgress = 0;
    uploadProgressCls = 'blue_cls';
    uploadDone = false;
    uploadId: any;

    constructor(config: TsFileUploadConfig, private _apiService: typeof ApiService, private setState: any) {

        if (config.allowed_types && config.allowed_types.length > 0) {
            this.allowed_types = config.allowed_types;
        }
        if (config.uploadUrl) {
            this.uploadUrl = config.uploadUrl;
        } else {
            this.onError('Endpoint not defined', 'error');
        }
        if (config.file) {
            this.file = config.file;
        } else if (config.files) {
            this.files = config.files;
        } else {
            this.onError('file / files not defined', 'error');
        }
        if (config.fileFieldName) {
            this.fileFieldName = config.fileFieldName;
        }
        if (config.generatePreview) {
            this.generatePreview = config.generatePreview;
        }
        if (config.extraPayload) {
            this.extraPayload = config.extraPayload;
        }

        this.prepareFiles();
        this.setState({wrapper: this});
    }

    static getExtension(fileName: string) {
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    updateExtraPayload(object:any) {
        this.extraPayload = {...this.extraPayload,...object};
    }

    onError(err: any, heading: any = null) {
        // console.error(err);
    }

    onSuccess(status: any) {
    }

    onProgress(progress: number) {
        // console.log({progress});
    }

    onFilesReady() {
    }

    checkAndPrepareFile(file: File | any, cb: any) {
        const ext = TsFileUploadWrapperClass.getExtension(file.name);
        
        if (this.allowed_types.indexOf(ext) > -1) {
            this.uploadId = CommonService.getRandomID(5);
            this.uploadDone = false;
            if (this.generatePreview) {
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    file.base64 = fileReader.result;
                    cb(file);
                };
                fileReader.readAsDataURL(file);
            } else {
                cb(file);
            }
        } else {
            this.onError('Only allowed ' + this.allowed_types.join(',') + '.', 'Not Allowed');
            cb(false);
        }
    }

    prepareFiles() {
        if (this.file) {
            this.checkAndPrepareFile(this.file, (file: any) => {
                if (file) {
                    this.file = file;
                    this.onFilesReady();
                }
            });
        } else if (this.files) {
            this.files.forEach((rawFile, index) => {
                this.checkAndPrepareFile(rawFile, (file: any, i: number) => {
                    if (file && this.files) {
                        this.files[index] = file;
                        // console.log(i === this.files.length, i, this.files.length);
                        if (i === this.files.length - 1) {
                            this.onFilesReady();
                        }
                    }
                });
            });
        }
    }

    stopUpload() {
        this.uploadDone = true;
        this.uploadProgress = 100;
        this.cancelToken.cancel('cancelled by user');
    }

    startUpload() {
        const formData = new FormData();
        for (const field in this.extraPayload) {
            if (this.extraPayload.hasOwnProperty(field)) {
                formData.append(field, this.extraPayload[field]);
            }
        }
        if (this.file) {
            formData.append(this.fileFieldName, this.file, this.file.name);
        } else if (this.files) {
            this.files.forEach((file) => {
                formData.append(this.fileFieldName, file, file.name);
            });
        }
        this.uploadText = 'Starting';
        this.uploadProgress = 0;
        this.uploadProgressCls = 'blue_cls';
        this.setState({wrapper: this});
        this._apiService.upload(this.uploadUrl, formData, {
                'Content-Type': false,
                Accept: 'application/json'
            }, {cancelToken: this.cancelToken.token},
            progress => {
                if (this.uploadProgress !== progress) {
                    this.uploadText = 'Uploading..';
                    this.uploadProgressCls = 'blue_cls';
                    this.uploadProgress = progress;
                    this.onProgress(progress);
                    this.setState({wrapper: this});
                }
            })
            .then((resp: any) => {
                this.uploadText = 'Completed';
                this.uploadProgressCls = 'green_cls';
                this.uploadDone = true;
                this.uploadProgress = 100;
                this.onSuccess(resp);
                this.setState({wrapper: this});
            })
            .catch(error => {
                this.uploadText = 'Error';
                this.uploadProgressCls = 'red_cls';
                this.uploadProgress = 100;
                this.uploadDone = false;
                this.onError(error);
                this.setState({wrapper: this});
            });
    }
}


/// Example code to upload with wrapper

// filesUploads: TsFileUploadWrapperClass;
// filesSelected(files: any[]) {
//   console.log('files', files);
//   console.log('files selected', files.length);
//   // files is a FileList of File objects. List some properties.
//   // const output = [];
//   this.images = [];
//   files = Array.from(files);
//   const uploadConfig: TsFileUploadConfig | any = {
//     files,
//     fileFieldName: 'image',
//     generatePreview: true,
//     uploadUrl: '/profile/upload',
//     allowed_types: ['png', 'jpg'],
//     extraPayload: {name: 'Santhosh', city: 'hyderabad'}
//   };
//   this.filesUploads = new TsFileUploadWrapperClass(uploadConfig, this._common._api);
//
//   this.filesUploads.onError = (err, heading) => {
//     console.error(err, heading);
//     this._common._alert.showAlert(err, 'error', heading);
//   };
//   this.filesUploads.onSuccess = ((status) => {
//     console.log(status);
//   });
//   this.filesUploads.onProgress = (() => {
//     console.log('progress');
//   });
//   this.filesUploads.startUpload();
// }
