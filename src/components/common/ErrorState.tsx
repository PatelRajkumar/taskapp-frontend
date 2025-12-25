/**
 * ErrorState Component
 * Displays an error state with icon and message
 */

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface ErrorStateProps {
  /**
   * Icon to display
   */
  icon: ReactNode;
  /**
   * Error title/message
   */
  title: string;
  /**
   * Optional error details
   */
  description?: string;
  /**
   * Optional retry action
   */
  action?: ReactNode;
}

/**
 * ErrorState - Display when an error occurs
 * 
 * @example
 * <ErrorState
 *   icon={<Error />}
 *   title="Failed to load projects"
 *   description={error.message}
 *   action={<Button onClick={handleRetry}>Retry</Button>}
 * />
 */
export const ErrorState = ({
  icon,
  title,
  description,
  action,
}: ErrorStateProps) => {
  console.error('[ErrorState] Rendering:', title, description);

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Box
        sx={{
          fontSize: 64,
          color: 'error.main',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>

      <Typography variant="h6" gutterBottom color="error">
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}

      {action && (
        <Box sx={{ mt: 3 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

export default ErrorState;