/**
 * IssueList Component
 * Displays a list of issue cards with loading and empty states
 */

import { Grid } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { IssueCard, IssueCardProps } from './IssueCard';
import type { IssueSummary } from '@/interceptors/types/issue.types';

export interface IssueListProps {
  /**
   * Array of issues to display
   */
  issues: IssueSummary[];
  /**
   * Whether data is loading
   */
  isLoading?: boolean;
  /**
   * Error message if fetch failed
   */
  error?: string | null;
  /**
   * Empty state message
   * @default "No issues found"
   */
  emptyMessage?: string;
  /**
   * Empty state description
   */
  emptyDescription?: string;
  /**
   * Callbacks passed to IssueCard
   */
  onClick?: IssueCardProps['onClick'];
  onEdit?: IssueCardProps['onEdit'];
  onDelete?: IssueCardProps['onDelete'];
  onStatusChange?: IssueCardProps['onStatusChange'];
  /**
   * Whether to show actions on cards
   * @default true
   */
  showActions?: boolean;
  /**
   * Whether to show status dropdown
   * @default true
   */
  showStatusDropdown?: boolean;
  /**
   * Number of skeleton cards to show while loading
   * @default 6
   */
  skeletonCount?: number;

  // NEW: Permission calculator functions (optional)
  canEditIssue?: (issue: IssueSummary) => boolean;
  canDeleteIssue?: (issue: IssueSummary) => boolean;
  canChangeStatus?: (issue: IssueSummary) => boolean;
}

/**
 * IssueList - Container for displaying multiple issue cards
 * 
 * Features:
 * - Grid layout (responsive)
 * - Loading skeletons
 * - Empty state with icon
 * - Error state
 * 
 * @example
 * <IssueList
 *   issues={issues}
 *   isLoading={isLoading}
 *   error={error?.message}
 *   emptyMessage="No issues yet"
 *   emptyDescription="Create your first issue to get started"
 *   onClick={handleClick}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onStatusChange={handleStatusChange}
 * />
 */
export const IssueList = ({
  issues,
  isLoading = false,
  error = null,
  emptyMessage = 'No issues found',
  emptyDescription,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
  showStatusDropdown = true,
  skeletonCount = 6,
  canEditIssue,      // NEW
  canDeleteIssue,    // NEW
  canChangeStatus,  // NEW
}: IssueListProps) => {
  console.log('[IssueList] Rendering with:', {
    issueCount: issues.length,
    isLoading,
    hasError: !!error,
  });

  // Loading State
  if (isLoading) {
    console.log('[IssueList] Showing loading skeletons');
    return (
      <LoadingState
        count={skeletonCount}
        height={220}
        layout="grid"
        gridColumns={{ xs: 12, sm: 6, md: 4 }}
      />
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorState
        icon={<Assignment />}
        title="Failed to load issues"
        description={error}
      />
    );
  }

  // Empty State
  if (issues.length === 0) {
    console.log('[IssueList] No issues to display');
    return (
      <EmptyState
        icon={<Assignment />}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  // Issues Grid
  console.log('[IssueList] Rendering', issues.length, 'issues');
  return (
    <Grid container spacing={3}>
      {issues.map((issue) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={issue.id}>
          <IssueCard
            issue={issue}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            showActions={showActions}
            showStatusDropdown={showStatusDropdown}
            canEdit={canEditIssue?.(issue)}      // NEW: Pass calculated permission
            canDelete={canDeleteIssue?.(issue)}  // NEW: Pass calculated permission
            canChangeStatus={canChangeStatus?.(issue)} // NEW: Pass calculated permission
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default IssueList;