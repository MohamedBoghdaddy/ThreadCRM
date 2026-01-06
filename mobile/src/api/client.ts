import axios from 'axios';
import { getToken } from '../store/authStore';


export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Attach token to each request if available
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
