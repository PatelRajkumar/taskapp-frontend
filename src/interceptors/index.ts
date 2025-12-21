/**
 * API Layer - Central export for all API functions and types
 */

// Export API client
export { default as apiClient, isAxiosError, clearAuthData } from '../api/client';

// Export Auth API functions
export {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getCurrentUser,
} from './endpoints/auth.api';

// Export Auth types
export type {
    UserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    MessageResponse,
    ApiErrorResponse,
    RoleResponse,
    PermissionResponse,
    UserMetadata,
    SessionMetadata,
} from './types/auth.types';

export { isApiErrorResponse } from './types/auth.types';

// Export User types
export type {
    UpdateUserRequest,
    ChangePasswordRequest,
} from './types/user.types';