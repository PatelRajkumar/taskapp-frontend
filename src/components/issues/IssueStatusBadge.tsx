/**
 * IssueStatusBadge Component
 * Displays issue status as a styled chip
 */

import { Chip } from '@mui/material';
import { Circle, PlayCircle, CheckCircle } from '@mui/icons-material';
import type { IssueStatus } from '@/utils/constants';

export interface IssueStatusBadgeProps {
  /**
   * Issue status
   */
  status: IssueStatus;
  /**
   * Size of the chip
   * @default 'small'
   */
  size?: 'small' | 'medium';
  /**
   * Chip variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';
}

/**
 * Get status icon
 */
const getStatusIcon = (status: IssueStatus) => {
  switch (status) {
    case 'TODO':
      return <Circle fontSize="small" />;
    case 'INPROGRESS':
      return <PlayCircle fontSize="small" />;
    case 'DONE':
      return <CheckCircle fontSize="small" />;
    default:
      return <Circle fontSize="small" />;
  }
};

/**
 * Get status color
 */
const getStatusColor = (status: IssueStatus): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'TODO':
      return 'default';
    case 'INPROGRESS':
      return 'primary';
    case 'DONE':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * Get status display name
 */
const getStatusLabel = (status: IssueStatus): string => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'INPROGRESS':
      return 'In Progress';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};

/**
 * IssueStatusBadge - Display issue status with icon and color
 * 
 * @example
 * <IssueStatusBadge status="INPROGRESS" />
 * <IssueStatusBadge status="DONE" size="medium" variant="outlined" />
 */
export const IssueStatusBadge = ({
  status,
  size = 'small',
  variant = 'filled',
}: IssueStatusBadgeProps) => {
  return (
    <Chip
      icon={getStatusIcon(status)}
      label={getStatusLabel(status)}
      size={size}
      color={getStatusColor(status)}
      variant={variant}
    />
  );
};

export default IssueStatusBadge;