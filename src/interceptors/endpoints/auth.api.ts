/**
 * Authentication API Endpoints
 * All functions for interacting with /api/auth endpoints
 */

import apiClient, { isAxiosError } from '../../api/client';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    MessageResponse,
    ApiErrorResponse,
} from '../types/auth.types';

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: any): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        if (data?.message) {
            return data.message;
        }

        if (data?.details) {
            // Combine field validation errors
            const fieldErrors = Object.values(data.details).join(', ');
            return fieldErrors || 'Validation error occurred';
        }

        if (error.response?.status === 401) {
            return 'Invalid email or password';
        }

        if (error.response?.status === 403) {
            return 'Account is locked or disabled';
        }

        if (error.response?.status === 409) {
            return 'Email already exists';
        }

        if (error.response?.status === 500) {
            return 'Server error. Please try again later';
        }

        if (error.message === 'Network Error') {
            return 'Unable to connect to server';
        }
    }

    return 'An unexpected error occurred';
};

/**
 * Register a new user account
 * POST /api/auth/register
 */
export const register = async (data: RegisterRequest): Promise<UserResponse> => {
    try {
        const response = await apiClient.post<UserResponse>('/auth/register', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Login with email and password
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Refresh access token using refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/refresh', {
            refreshToken,
        } as RefreshTokenRequest);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Logout current user
 * POST /api/auth/logout
 */
export const logout = async (): Promise<MessageResponse> => {
    try {
        const response = await apiClient.post<MessageResponse>('/auth/logout');
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    try {
        const response = await apiClient.post<MessageResponse>('/auth/forgot-password', data);
        return response.data;
    } catch (error) {
        // Always return success for security (don't reveal if email exists)
        return { message: 'If the email exists, a password reset link has been sent' };
    }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    try {
        const response = await apiClient.post<MessageResponse>('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Verify email with token
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<MessageResponse> => {
    try {
        const response = await apiClient.post<MessageResponse>('/auth/verify-email', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Resend email verification
 * POST /api/auth/resend-verification
 */
export const resendVerification = async (
    data: ResendVerificationRequest
): Promise<MessageResponse> => {
    try {
        const response = await apiClient.post<MessageResponse>('/auth/resend-verification', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get current user profile
 * GET /api/users/me
 * Note: This endpoint might be /api/auth/me depending on your backend implementation
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
    try {
        const response = await apiClient.get<UserResponse>('/users/me');
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};