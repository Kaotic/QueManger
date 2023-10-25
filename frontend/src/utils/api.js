import axios from 'axios';
import { envType } from "./environment";

const env = envType();
const environments = {
    "LOCAL": {
        apiUrl: "http://localhost:8000/",
    },
    "PROD": {
        apiUrl: "https://api.que-manger.kao.cx/",
    }
};

export const API_URL = environments[env].apiUrl;
export const PROXY_IMAGE_URL = API_URL + "proxy/image?url=";

const api = axios.create({
	baseURL: API_URL,
});

export default api;
