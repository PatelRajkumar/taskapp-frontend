/**
 * EmptyState Component
 * Displays an empty state with icon and message
 */

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon: ReactNode;
  /**
   * Main title/message
   */
  title: string;
  /**
   * Optional description/subtitle
   */
  description?: string;
  /**
   * Optional action button or link
   */
  action?: ReactNode;
}

/**
 * EmptyState - Display when no data is available
 * 
 * @example
 * <EmptyState
 *   icon={<FolderOff />}
 *   title="No projects found"
 *   description="Create your first project to get started"
 *   action={<Button onClick={handleCreate}>Create Project</Button>}
 * />
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  console.log('[EmptyState] Rendering:', title);

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
          color: 'text.disabled',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>

      <Typography variant="h6" gutterBottom color="text.secondary">
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

export default EmptyState;