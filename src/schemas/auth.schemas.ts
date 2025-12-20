import { z } from 'zod';

/**
 * Login Form Schema
 * Matches backend LoginRequestDTO validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid'),

  password: z
    .string()
    .min(1, 'Password is required'),

  rememberMe: z.boolean()

});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Form Schema
 * Matches backend RegisterRequestDTO validation with exact password requirements
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters'),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character (@#$%^&+=), and no whitespace'
    ),

  passwordConfirm: z
    .string()
    .min(1, 'Please confirm your password'),

  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),

  subscribeToNewsletter: z
    .boolean(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot Password Form Schema
 * Matches backend ForgotPasswordRequest validation
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Form Schema
 * Matches backend ResetPasswordRequest validation
 */
export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character (@#$%^&+=), and no whitespace'
    ),

  newPasswordConfirm: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: 'Passwords do not match',
  path: ['newPasswordConfirm'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;