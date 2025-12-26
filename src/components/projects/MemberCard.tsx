/**
 * MemberCard Component
 * Displays a single project member with actions
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  SwapHoriz,
  AdminPanelSettings,
  Person,
  Visibility,
  Shield,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/profile';
import type { ProjectMemberSummary, ProjectRole } from '@/interceptors/types/projectMember.types';

export interface MemberCardProps {
  /**
   * Member data to display
   */
  member: ProjectMemberSummary;
  /**
   * Current user's role in project
   */
  currentUserRole?: ProjectRole;
  /**
   * Callback when edit role is clicked
   */
  onEditRole?: (member: ProjectMemberSummary) => void;
  /**
   * Callback when remove is clicked
   */
  onRemove?: (member: ProjectMemberSummary) => void;
  /**
   * Whether to show action menu
   * @default true
   */
  showActions?: boolean;
}

/**
 * Get role icon
 */
const getRoleIcon = (role: ProjectRole) => {
  switch (role) {
    case 'OWNER':
      return <Shield fontSize="small" />;
    case 'ADMIN':
      return <AdminPanelSettings fontSize="small" />;
    case 'MEMBER':
      return <Person fontSize="small" />;
    case 'VIEWER':
      return <Visibility fontSize="small" />;
    default:
      return <Person fontSize="small" />;
  }
};

/**
 * Get role color
 */
const getRoleColor = (role: ProjectRole): 'error' | 'warning' | 'primary' | 'default' => {
  switch (role) {
    case 'OWNER':
      return 'error';
    case 'ADMIN':
      return 'warning';
    case 'MEMBER':
      return 'primary';
    case 'VIEWER':
      return 'default';
    default:
      return 'default';
  }
};

/**
 * MemberCard - Displays project member information
 * 
 * Features:
 * - Member name, email, avatar
 * - Role chip with icon
 * - Joined date
 * - Actions menu (edit role, remove, transfer ownership)
 * - Permission-based actions
 * 
 * @example
 * <MemberCard
 *   member={member}
 *   currentUserRole="OWNER"
 *   onEditRole={handleEditRole}
 *   onRemove={handleRemove}
 *   onTransferOwnership={handleTransfer}
 * />
 */
export const MemberCard = ({
  member,
  currentUserRole,
  onEditRole,
  onRemove,
  showActions = true,
}: MemberCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  console.log('[MemberCard] Rendering member:', member.user.name, 'Role:', member.role);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log('[MemberCard] Menu opened for:', member.user.name);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditRole = () => {
    console.log('[MemberCard] Edit role clicked for:', member.user.name);
    handleMenuClose();
    onEditRole?.(member);
  };

  const handleRemove = () => {
    console.log('[MemberCard] Remove clicked for:', member.user.name);
    handleMenuClose();
    onRemove?.(member);
  };


  // Determine available actions based on permissions
  const canEditRole = currentUserRole === 'OWNER' || (currentUserRole === 'ADMIN' && member.role !== 'OWNER' && member.role !== 'ADMIN');
  const canRemove = currentUserRole === 'OWNER' || (currentUserRole === 'ADMIN' && member.role !== 'OWNER' && member.role !== 'ADMIN');
  const canTransferOwnership = currentUserRole === 'OWNER' && member.role === 'ADMIN';

  const hasAnyAction = canEditRole || canRemove || canTransferOwnership;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        name={member.user.name}
        src={member.user.avatarUrl}
        size="medium"
      />

      {/* Member Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={500} noWrap>
          {member.user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {member.user.email}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
        </Typography>
      </Box>

      {/* Role Chip */}
      <Chip
        icon={getRoleIcon(member.role)}
        label={member.roleDisplayName}
        size="small"
        color={getRoleColor(member.role)}
        variant="outlined"
      />

      {/* Actions Menu */}
      {showActions && hasAnyAction && (
        <>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            {canEditRole && (
              <MenuItem onClick={handleEditRole}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Change Role</ListItemText>
              </MenuItem>
            )}

            {canRemove && (
              <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Remove Member</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default MemberCard;