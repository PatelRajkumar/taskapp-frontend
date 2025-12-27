/**
 * IssuePriorityBadge Component
 * Displays issue priority as a styled chip
 */

import { Chip } from '@mui/material';
import { KeyboardDoubleArrowUp, Remove, KeyboardDoubleArrowDown } from '@mui/icons-material';
import type { IssuePriority } from '@/utils/constants';

export interface IssuePriorityBadgeProps {
  /**
   * Issue priority
   */
  priority: IssuePriority;
  /**
   * Size of the chip
   * @default 'small'
   */
  size?: 'small' | 'medium';
  /**
   * Chip variant
   * @default 'outlined'
   */
  variant?: 'filled' | 'outlined';
}

/**
 * Get priority icon
 */
const getPriorityIcon = (priority: IssuePriority) => {
  switch (priority) {
    case 'HIGH':
      return <KeyboardDoubleArrowUp fontSize="small" />;
    case 'MEDIUM':
      return <Remove fontSize="small" />;
    case 'LOW':
      return <KeyboardDoubleArrowDown fontSize="small" />;
    default:
      return <Remove fontSize="small" />;
  }
};

/**
 * Get priority color
 */
const getPriorityColor = (priority: IssuePriority): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (priority) {
    case 'HIGH':
      return 'error';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * IssuePriorityBadge - Display issue priority with icon and color
 * 
 * @example
 * <IssuePriorityBadge priority="HIGH" />
 * <IssuePriorityBadge priority="MEDIUM" size="medium" variant="filled" />
 */
export const IssuePriorityBadge = ({
  priority,
  size = 'small',
  variant = 'outlined',
}: IssuePriorityBadgeProps) => {
  return (
    <Chip
      icon={getPriorityIcon(priority)}
      label={priority}
      size={size}
      color={getPriorityColor(priority)}
      variant={variant}
    />
  );
};

export default IssuePriorityBadge;