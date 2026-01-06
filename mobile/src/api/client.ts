import axios from 'axios';
import { getToken } from '../store/authStore';

// Replace YOUR_LOCAL_IP with your local machine IP address accessible from your device.
export const api = axios.create({
  baseURL: 'http://YOUR_LOCAL_IP:4000/api',
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
