/**
 * MemberList Component
 * Displays a list of project members with loading and empty states
 */

import { Box } from '@mui/material';
import { People } from '@mui/icons-material';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { MemberCard, MemberCardProps } from './MemberCard';
import type { ProjectMemberSummary, ProjectRole } from '@/interceptors/types/projectMember.types';

export interface MemberListProps {
  /**
   * Array of members to display
   */
  members: ProjectMemberSummary[];
  /**
   * Current user's role in project
   */
  currentUserRole?: ProjectRole;
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
   * @default "No members found"
   */
  emptyMessage?: string;
  /**
   * Empty state description
   */
  emptyDescription?: string;
  /**
   * Callbacks passed to MemberCard
   */
  onEditRole?: MemberCardProps['onEditRole'];
  onRemove?: MemberCardProps['onRemove'];
  /**
   * Whether to show actions on cards
   * @default true
   */
  showActions?: boolean;
  /**
   * Number of skeleton cards to show while loading
   * @default 5
   */
  skeletonCount?: number;
}

/**
 * MemberList - Container for displaying project members
 * 
 * Features:
 * - Vertical list layout
 * - Loading skeletons
 * - Empty state with icon
 * - Error state
 * - Sorted by role (OWNER → ADMIN → MEMBER → VIEWER)
 * 
 * @example
 * <MemberList
 *   members={members}
 *   currentUserRole="OWNER"
 *   isLoading={isLoading}
 *   error={error?.message}
 *   emptyMessage="No members yet"
 *   emptyDescription="Add members to collaborate on this project"
 *   onEditRole={handleEditRole}
 *   onRemove={handleRemove}
 *   onTransferOwnership={handleTransfer}
 * />
 */
export const MemberList = ({
  members,
  currentUserRole,
  isLoading = false,
  error = null,
  emptyMessage = 'No members found',
  emptyDescription,
  onEditRole,
  onRemove,
  showActions = true,
  skeletonCount = 5,
}: MemberListProps) => {
  console.log('[MemberList] Rendering with:', {
    memberCount: members.length,
    isLoading,
    hasError: !!error,
  });

  // Loading State
  if (isLoading) {
    console.log('[MemberList] Showing loading skeletons');
    return (
      <LoadingState
        count={skeletonCount}
        height={80}
        layout="list"
      />
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorState
        icon={<People />}
        title="Failed to load members"
        description={error}
      />
    );
  }

  // Empty State
  if (members.length === 0) {
    console.log('[MemberList] No members to display');
    return (
      <EmptyState
        icon={<People />}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  // Sort members by role hierarchy: OWNER → ADMIN → MEMBER → VIEWER
  const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2, VIEWER: 3 };
  const sortedMembers = [...members].sort((a, b) => {
    return roleOrder[a.role] - roleOrder[b.role];
  });

  console.log('[MemberList] Rendering', sortedMembers.length, 'members');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {sortedMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserRole={currentUserRole}
          onEditRole={onEditRole}
          onRemove={onRemove}
          showActions={showActions}
        />
      ))}
    </Box>
  );
};

export default MemberList;