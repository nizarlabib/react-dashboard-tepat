export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  gender: "male" | "female";
  role_id: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface MeResponse {
  id: number;
  fullname: string;
  email: string;
  role: string;
  role_id: string;
  permissions: string;
  permission_mask: string;
  impersonated_by?: number;
}

export interface CsrfTokenResponse {
  csrf_token: string;
}
