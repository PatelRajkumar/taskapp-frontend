/**
 * User Profile API Endpoints
 * All functions for interacting with /api/users endpoints
 */

import apiClient, { isAxiosError } from '../../api/client';
import type { UserResponse, MessageResponse, ApiErrorResponse } from '../types/auth.types';
import type { UpdateUserRequest, ChangePasswordRequest } from '../types/user.types';
import type { PageResponse, PageableRequest } from '../types/project.types';


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
      const fieldErrors = Object.values(data.details).join(', ');
      return fieldErrors || 'Validation error occurred';
    }

    if (error.response?.status === 400) {
      return 'Invalid request data';
    }

    if (error.response?.status === 401) {
      return 'You must be logged in to perform this action';
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
 * Update current user profile
 * PUT /api/users/me
 */
export const updateProfile = async (data: UpdateUserRequest): Promise<UserResponse> => {
  try {
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Change current user password
 * POST /api/users/me/change-password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<MessageResponse> => {
  try {
    const response = await apiClient.post<MessageResponse>('/users/me/change-password', data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Delete current user account
 * DELETE /api/users/me
 */
export const deleteAccount = async (): Promise<void> => {
  try {
    await apiClient.delete('/users/me');
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Search users by name or email
 * GET /api/users/search?query={searchTerm}
 * 
 * @param searchTerm - Search query (name or email)
 * @param params - Pagination parameters
 * @returns Paginated list of users
 */
export const searchUsers = async (
  searchTerm: string,
  params?: PageableRequest
): Promise<PageResponse<UserResponse>> => {
  try {
    const response = await apiClient.get<PageResponse<UserResponse>>('/users/search', {
      params: {
        query: searchTerm,
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort,
      },
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Get all users (paginated)
 * GET /api/users
 * 
 * @param params - Pagination parameters
 * @returns Paginated list of users
 */
export const getAllUsers = async (
  params?: PageableRequest
): Promise<PageResponse<UserResponse>> => {
  try {
    const response = await apiClient.get<PageResponse<UserResponse>>('/users', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort ?? 'createdAt,desc',
      },
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Get user by ID
 * GET /api/users/{id}
 * 
 * @param userId - User ID
 * @returns User details
 */
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.get<UserResponse>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};