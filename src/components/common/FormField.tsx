import { Box, FormHelperText, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface FormFieldProps {
  /**
   * Label for the form field
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * The input component
   */
  children: ReactNode;
  /**
   * Additional spacing at the bottom
   * @default 2
   */
  mb?: number;
}

/**
 * FormField component that wraps form inputs with consistent label and error styling
 * 
 * @example
 * <FormField label="Email" required error={errors.email?.message}>
 *   <Input
 *     type="email"
 *     {...register('email')}
 *   />
 * </FormField>
 * 
 * @example
 * <FormField label="Password" helperText="Must be at least 8 characters">
 *   <Input type="password" />
 * </FormField>
 */
export const FormField = ({
  label,
  error,
  required = false,
  helperText,
  children,
  mb = 2,
}: FormFieldProps) => {
  return (
    <Box sx={{ mb }}>
      {label && (
        <Typography
          variant="body2"
          component="label"
          sx={{
            display: 'block',
            mb: 0.5,
            fontWeight: 500,
            color: error ? 'error.main' : 'text.primary',
          }}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}

      {children}

      {(error || helperText) && (
        <FormHelperText error={!!error} sx={{ mt: 0.5, mx: 0 }}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormField;