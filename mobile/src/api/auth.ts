import { api } from './client';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function register(payload: RegisterPayload) {
  const res = await api.post('/auth/register', payload);
  return res.data;
}
