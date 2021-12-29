import axios, {
    AxiosAdapter,
    AxiosBasicCredentials,
    AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosTransformer,
    CancelToken,
    ResponseType
} from 'axios';
import Communications from "./communications-service";
import {ENV} from "../constants";

export const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}
export const defaultOptions = {}

let jwtToken: string | undefined = '';

Communications.updateLoginUserTokenSubject.subscribe(token => {
    jwtToken = token;
})

const getHeaders = (headers: any) => {
    const Authorization = {'Authorization': 'Bearer ' + jwtToken};
    headers = {
        ...defaultHeaders, ...Authorization, ...headers
    }
    return headers;
}

const getUploadHeaders=(headers: any) => {
    headers = {
        ...defaultHeaders, ...headers
    }
    return headers;
}


const getPayload = (payload: any | FormData, isFormData = false) => {
    if (isFormData) {
        // payload.append('active_user_id', activeUserId);
        return payload;
    } else {
        return {...payload};
    }
}

export interface TSAPIResponseType {
    success: boolean,
    data: any | { docs: any[], total: number, pages: number, limit: number, page: number },
    msg?: string,
    error?: string,
    errors?: any
}

export interface AxiosOptions {
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    paramsSerializer?: (params: any) => string;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
}

const ApiService = {
    post: (url: string, payload = {},
           headers = {}, options: AxiosOptions = {},
           progressCallback: (progress: number) => void = (progress) => {
           }): Promise<TSAPIResponseType> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        payload = getPayload(payload);
        let request = axios.post(url, payload, axiosOptions);
        return getRequestPromise(request);
    },
    put: (url: string, payload = {},
           headers = {}, options: AxiosOptions = {},
           progressCallback: (progress: number) => void = (progress) => {
           }): Promise<TSAPIResponseType> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        payload = getPayload(payload);
        let request = axios.put(url, payload, axiosOptions);
        return getRequestPromise(request);
    },

    patch: (url: string, payload = {},
        headers = {}, options: AxiosOptions = {},
        progressCallback: (progress: number) => void = (progress) => {
        }): Promise<TSAPIResponseType> => {
     const axiosOptions: AxiosRequestConfig = {
         headers: getHeaders(headers),
         ...options,
         onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
     };
     payload = getPayload(payload);
     let request = axios.patch(url, payload, axiosOptions);
     return getRequestPromise(request);
    },
    upload: (url: string, payload :any,
             headers = {}, options: AxiosOptions = {},
             progressCallback: (progress: number) => void = (progress) => {
             }): Promise<TSAPIResponseType> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getUploadHeaders(headers),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        payload = getPayload(payload, true);
        let request = axios.put(url, payload, axiosOptions);
        return getRequestPromise(request);
    },
    get: (url: string, payload = {}, headers = {},
          options: AxiosOptions = {}): Promise<TSAPIResponseType> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            params: getPayload(payload),
            ...options,
        };
        let request = axios.get(url, axiosOptions);
        return getRequestPromise(request);
    },
    delete: (url: string, payload = {}, headers = {},
             options: AxiosOptions = {}): Promise<TSAPIResponseType> => {
        // options = getParsedOptions(headers, options);
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            data: getPayload(payload),
            ...options
        };
        let request = axios.delete(url, axiosOptions);
        return getRequestPromise(request);
    }
}

const uploadProgressHandler = (progressCallback: (progress: number) => void, progressEvent: any) => {
    if (progressCallback) {
        const percentFraction = progressEvent.loaded / progressEvent.total;
        const percent = Math.floor(percentFraction * 100);
        progressCallback(percent);
    }
}
const getRequestPromise = (request: Promise<AxiosResponse>) => {
    return new Promise<any>((resolve, reject) => {
        request
            .then((resp) => {

                if(ENV.ENV_MODE === 'development') {
                    console.log('====>>>>>>', resp.data);
                }
                resolve({...resp.data, status: resp.status});
            })
            .catch((err: any) => {
                if(ENV.ENV_MODE === 'development') {
                    console.error('=====>', err, 'API Error');
                }
                try {
                    const response: any = (err.response) ? err.response : {data: null};
                    let error: any = (response.data) ? {...response.data} : {status: 500};
                    error.status = response.status ? parseInt(response.status) : 500;
                    if (error.status === 401) {
                        Communications.logoutSubject.next();
                    }
                    if (error.status === 403) {
                        Communications.ReloadStateSubject.next();
                    }
                    if (axios.isCancel(err)) {
                        error.status = 499;
                    }
                    reject(error);
                } catch (e) {
                    console.error('=====>',e, 'Api Function Catch');
                }
            });
    });
}

export default ApiService;
