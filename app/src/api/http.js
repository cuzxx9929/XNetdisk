import axios from 'axios'
import store from '@/store'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"



let requests = axios.create({
    // baseURL: 'http://43.142.102.210:8888',
    baseURL: 'https://cuzxx.xyz:443',
    // baseURL:'https://localhost:443',
    // timeout: 5000,
    withCredentials: true
});

requests.interceptors.request.use(config => {
    nprogress.start();

    if (store.state.user.token) {
        config.headers.Authorization = store.state.user.token;
    }

    return config;
}); 

requests.interceptors.response.use((res) => {
    nprogress.done();
    return res.data;
}, (err) => {
    alert(err.message);
    return new Promise();
});

export default requests