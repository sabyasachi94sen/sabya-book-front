import useToken from "antd/es/theme/useToken";
import axios from "axios";
import { base_url } from "../baseUrl";
import getLocalStorage from "../helpers/getLocalStorage";
import ErrorHandle from "./errorHandle";

const api = axios.create({
    baseURL: base_url,
    headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
})

api.interceptors.request.use((config) => {
    const data = getLocalStorage("user");
    if (data) {
        const userData = JSON.parse(data);
        const { token } = userData;
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    }
})

api.interceptors.response.use((res) => {
    return res;
},
    async err => {
        ErrorHandle(err)
        throw err;
    }
)

export default api;