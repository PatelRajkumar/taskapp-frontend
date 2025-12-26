/**
 * Authentication API Types
 * These types match the backend DTOs exactly
 */

import { SystemRole } from '@/utils/constants';

/**
 * User role response
 */
export interface RoleResponse {
  id: string;
  name: String;
  description?: string;
}

/**
 * User permission response
 */
export interface PermissionResponse {
  id: string;
  code: string;
  description?: string;
}

/**
 * User metadata
 */
export interface UserMetadata {
  failedLoginAttempts?: number;
  lastFailedLoginAt?: string;
  lockedUntil?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  twoFactorEnabled: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  passwordChangedAt?: string;
  registrationSource?: string;
  preferredLanguage?: string;
  timezone?: string;
  loginCount?: number;
}

/**
 * User response (matches backend UserResponseDTO)
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  roles?: RoleResponse[];
  permissions?: PermissionResponse[];
  metadata?: UserMetadata;
}

/**
 * Session metadata
 */
export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  loginAt?: string;
}

/**
 * Login response (matches backend LoginResponseDTO)
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
  sessionMetadata?: SessionMetadata;
  requiresTwoFactor?: boolean;
  twoFactorSessionToken?: string;
}

/**
 * Login request (matches backend LoginRequestDTO)
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Register request (matches backend RegisterRequestDTO)
 */
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  avatarUrl?: string;
  acceptTerms: boolean;
  subscribeToNewsletter?: boolean;
  referralCode?: string;
}

/**
 * Refresh token request (matches backend RefreshTokenRequestDTO)
 */
export interface RefreshTokenRequest {
  refreshToken: string;
  rotateRefreshToken?: boolean;
  ipAddress?: string;
  deviceInfo?: string
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
}

/**
 * Verify email request
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Resend verification email request
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Generic message response
 */
export interface MessageResponse {
  message: string;
}

/**
 * API Error Response
 * Structure matches backend exception handler responses
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  path?: string;
  details?: Record<string, Object>; // Field validation errors
}

/**
 * Type guard to check if error is ApiErrorResponse
 */
export const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
};