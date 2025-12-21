/**
 * User Profile API Types
 * These types match the backend DTOs exactly
 */

/**
 * Update user profile request (matches backend UserUpdateDTO)
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * Change password request (matches backend PasswordChangeDTO)
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}