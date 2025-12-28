/**
 * IssueCard Component
 * Displays a single issue with actions
 */

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { IssueSummary } from '@/interceptors/types/issue.types';
import { IssueStatusBadge } from './IssueStatusBadge';
import { IssuePriorityBadge } from './IssuePriorityBadge';
import { IssueTypeBadge } from './IssueTypeBadge';
import type { IssueStatus } from '@/utils/constants';

export interface IssueCardProps {
  issue: IssueSummary;
  onClick?: (issue: IssueSummary) => void;
  onEdit?: (issue: IssueSummary) => void;
  onDelete?: (issue: IssueSummary) => void;
  onStatusChange?: (issue: IssueSummary, newStatus: IssueStatus) => void;
  showActions?: boolean;
  showStatusDropdown?: boolean;
  // NEW: Permission overrides (optional)
  canEdit?: boolean;
  canDelete?: boolean;
  canChangeStatus?: boolean;
}
/**
 * IssueCard - Displays issue information in a card format
 * 
 * Features:
 * - Issue key, title, type, priority, status
 * - Assignee name (not avatar per requirement)
 * - Due date if set
 * - Quick status change dropdown
 * - Actions menu (edit, delete)
 * - Click to navigate to issue details
 * 
 * @example
 * <IssueCard
 *   issue={issue}
 *   onClick={handleClick}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onStatusChange={handleStatusChange}
 * />
 */
export const IssueCard = ({
  issue,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
  showActions = true,
  showStatusDropdown = true,
  canEdit = true,         // NEW: Default to true for backward compatibility
  canDelete = true,       // NEW: Default to true for backward compatibility
  canChangeStatus = true, // NEW: Default to true for backward compatibility
}: IssueCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  console.log('[IssueCard] Rendering issue:', issue.key);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click
    setAnchorEl(event.currentTarget);
    console.log('[IssueCard] Menu opened for issue:', issue.key);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    console.log('[IssueCard] Menu closed');
  };

  const handleCardClick = () => {
    console.log('[IssueCard] Card clicked:', issue.key);
    onClick?.(issue);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[IssueCard] Edit clicked for issue:', issue.key);
    handleMenuClose();
    onEdit?.(issue);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[IssueCard] Delete clicked for issue:', issue.key);
    handleMenuClose();
    onDelete?.(issue);
  };

  const handleStatusChange = (e: SelectChangeEvent<IssueStatus>) => {
    e.stopPropagation();
    const newStatus = e.target.value as IssueStatus;
    console.log('[IssueCard] Status changed:', issue.key, newStatus);
    onStatusChange?.(issue, newStatus);
  };

  // Check if due date is overdue
  const isDueToday = issue.dueDate && new Date(issue.dueDate).toDateString() === new Date().toDateString();
  const isOverdue = issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'DONE';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': onClick ? {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        } : {},
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with Key and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="primary" fontWeight="bold">
            {issue.key}
          </Typography>
          
          {showActions && ((canEdit && onEdit) || (canDelete && onDelete)) && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ mt: -1, mr: -1 }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Issue Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {issue.title}
        </Typography>

        {/* Status Badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {/* Type Badge - Always show */}
          <IssueTypeBadge type={issue.type} />
          
          {/* Priority Badge - Always show */}
          <IssuePriorityBadge priority={issue.priority} />
          
          {/* Status Badge or Dropdown - Show on desktop, hide on mobile if dropdown enabled */}
          {showStatusDropdown && canChangeStatus && onStatusChange ? (
            <FormControl 
              size="small" 
              onClick={(e) => e.stopPropagation()}
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                minWidth: 120,
              }}
            >
              <Select
                value={issue.status}
                onChange={handleStatusChange}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.8125rem',
                  '& .MuiSelect-select': {
                    py: 0.25,
                    px: 1,
                  },
                }}
              >
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="INPROGRESS">In Progress</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <IssueStatusBadge status={issue.status} />
          )}
          
          {/* Status Badge on mobile */}
          {showStatusDropdown && onStatusChange && (
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IssueStatusBadge status={issue.status} />
            </Box>
          )}
        </Box>

        {/* Assignee and Due Date */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Assignee NAME (not avatar) */}
          {issue.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {issue.assignee.name}
              </Typography>
            </Box>
          )}
          
          {/* Due Date */}
          {issue.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography 
                variant="caption" 
                color={isOverdue ? 'error' : isDueToday ? 'warning.main' : 'text.secondary'}
                fontWeight={isOverdue || isDueToday ? 600 : 400}
              >
                {isOverdue ? 'Overdue: ' : isDueToday ? 'Due today' : 'Due '}
                {!isDueToday && formatDistanceToNow(new Date(issue.dueDate), { addSuffix: true })}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Last Updated */}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Updated {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
        </Typography>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {canEdit && onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Issue</ListItemText>
          </MenuItem>
        )}

        {canDelete && onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Issue</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default IssueCard;