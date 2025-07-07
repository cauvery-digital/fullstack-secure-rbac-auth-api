import axios from 'axios';
const API = axios.create({
  baseURL: 'https://your-backend.onrender.com/api',
  withCredentials: true,
});
export default API;