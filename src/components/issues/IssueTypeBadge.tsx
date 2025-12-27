/**
 * IssueTypeBadge Component
 * Displays issue type as a styled chip
 */

import { Chip } from '@mui/material';
import { BugReport, Assignment } from '@mui/icons-material';
import type { IssueType } from '@/utils/constants';

export interface IssueTypeBadgeProps {
  /**
   * Issue type
   */
  type: IssueType;
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
 * Get type icon
 */
const getTypeIcon = (type: IssueType) => {
  switch (type) {
    case 'BUG':
      return <BugReport fontSize="small" />;
    case 'TASK':
      return <Assignment fontSize="small" />;
    default:
      return <Assignment fontSize="small" />;
  }
};

/**
 * Get type color
 */
const getTypeColor = (type: IssueType): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary' => {
  switch (type) {
    case 'BUG':
      return 'error';
    case 'TASK':
      return 'primary';
    default:
      return 'default';
  }
};

/**
 * IssueTypeBadge - Display issue type with icon and color
 * 
 * @example
 * <IssueTypeBadge type="BUG" />
 * <IssueTypeBadge type="TASK" size="medium" variant="filled" />
 */
export const IssueTypeBadge = ({
  type,
  size = 'small',
  variant = 'outlined',
}: IssueTypeBadgeProps) => {
  return (
    <Chip
      icon={getTypeIcon(type)}
      label={type}
      size={size}
      color={getTypeColor(type)}
      variant={variant}
    />
  );
};

export default IssueTypeBadge;