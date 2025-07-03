import { axiosInstance } from "./axios";

interface GenerateHtmlResponse {
    data: any;
}

export const generateHtml = (jsx: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Check if url is present in env
        const url = process.env.REACT_APP_SSR_EXPORT_HTML_URL;
        
        if (!url) {
            reject(new Error('REACT_APP_SSR_EXPORT_HTML_URL is not configured'));
            return;
        }

        axiosInstance
            .post<GenerateHtmlResponse>(url, { app: jsx }, { 
                headers: { "Content-Type": "application/json" } 
            })
            .then(response => {
                if (response) {
                    resolve(response.data);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};
