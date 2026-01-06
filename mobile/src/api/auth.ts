import { api } from "./client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: any;
  data?: any;
}

function normalizeAuthResponse(resData: AuthResponse) {
  // Try common token field names
  const token =
    resData.token ||
    resData.accessToken ||
    resData.jwt ||
    resData?.data?.token ||
    resData?.data?.accessToken;

  const user = resData.user || resData?.data?.user || undefined;

  if (!token) {
    console.warn("⚠️ auth.ts: No token found in response:", resData);
  }

  return { token, user };
}

export async function login(payload: LoginPayload) {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return normalizeAuthResponse(res.data);
}

export async function register(payload: RegisterPayload) {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return normalizeAuthResponse(res.data);
}
