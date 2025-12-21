import { z } from 'zod';

/**
 * Update Profile Schema
 * Matches backend UserUpdateDTO validation
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters'),
  
  avatarUrl: z
    .string()
    .max(1000, 'Avatar URL must not exceed 1000 characters')
    .regex(/^(https?:\/\/.*)?$/, 'Avatar URL must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Change Password Schema
 * Matches backend PasswordChangeDTO validation
 */
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character (@#$%^&+=), and no whitespace'
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.newPassword !== data.oldPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;