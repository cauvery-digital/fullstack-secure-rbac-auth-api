import API from '../api/axios';
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.get('/auth/logout');
export const refreshToken = () => API.get('/auth/refresh-token');