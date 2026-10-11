import axios from 'axios';

const API = axios.create({
    baseURL: 'https://freshmart-backend-nrt4.onrender.com/api/',
});

export default API;