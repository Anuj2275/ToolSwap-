import axios from 'axios';

const api = axios.create({
//    baseURL:'https://toolswap-backend.onrender.com',
    baseURL:'https://toolswap.onrender.com',
})


api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('authToken');

        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },

    (error)=>{
        return Promise.reject(error);
    }
)



// new thing, and its optional 

api.interceptors.response.use(
    (response) => response,
    (error)=>{
        if(error.response && error.response.status === 401){
            console.error('Unauthorized access - redirecting to login.');

            localStorage.removeItem('authToken');
            window.location.href = '/login'
        }
        return Promise.reject(error);
    }
)


export default api;