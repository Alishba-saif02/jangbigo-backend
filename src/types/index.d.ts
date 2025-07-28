import { Request } from "express";

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  kakaoId?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KakaoProfile {
  id: number;
  username: string;
  displayName: string;
  _json: {
    id: number;
    connected_at: string;
    properties: {
      nickname: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
    kakao_account: {
      profile_needs_agreement: boolean;
      profile: {
        nickname: string;
        thumbnail_image_url?: string;
        profile_image_url?: string;
        is_default_image: boolean;
      };
      email_needs_agreement: boolean;
      is_email_valid: boolean;
      is_email_verified: boolean;
      email?: string;
      age_range_needs_agreement: boolean;
      age_range?: string;
      birthday_needs_agreement: boolean;
      birthday?: string;
      gender_needs_agreement: boolean;
      gender?: string;
      phone_number_needs_agreement: boolean;
      phone_number?: string;
      ci_needs_agreement: boolean;
      ci?: string;
      ci_authenticated_at?: string;
    };
  };
}

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  profileImage?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  token?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
