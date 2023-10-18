import axios from "axios";

const service = axios.create({
    baseURL: 'https://43.249.207.238/api/',
    timeout: 5000,
});

//添加响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        return res;
    },
    error => {
        return error;
    }
);

//导出实例
export default service;