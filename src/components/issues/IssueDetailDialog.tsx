/**
 * IssueDetailDialog Component
 * Dialog for displaying full issue details
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import {
  Close,
  Edit,
  Delete,
  Person,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/common';
import { RichTextDisplay } from './RichTextDisplay';
import { IssueStatusBadge } from './IssueStatusBadge';
import { IssuePriorityBadge } from './IssuePriorityBadge';
import { IssueTypeBadge } from './IssueTypeBadge';
import type { IssueResponse } from '@/interceptors/types/issue.types';
import type { IssueStatus } from '@/utils/constants';

export interface IssueDetailDialogProps {
  /**
   * Whether dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog should close
   */
  onClose: () => void;
  /**
   * Issue to display
   */
  issue: IssueResponse | null;
  /**
   * Callback when edit is clicked
   */
  onEdit?: (issue: IssueResponse) => void;
  /**
   * Callback when delete is clicked
   */
  onDelete?: (issue: IssueResponse) => void;
  /**
   * Callback when status changes
   */
  onStatusChange?: (issue: IssueResponse, newStatus: IssueStatus) => void;
  /**
   * Whether currently loading
   */
  isLoading?: boolean;
}

/**
 * IssueDetailDialog - Full issue details in a dialog
 * 
 * Features:
 * - Full issue information
 * - Rich text description display (HTML rendered)
 * - Status change dropdown
 * - Edit and delete actions
 * - Responsive design
 * - Close on backdrop click or ESC
 * 
 * @example
 * <IssueDetailDialog
 *   open={dialogOpen}
 *   onClose={handleClose}
 *   issue={selectedIssue}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onStatusChange={handleStatusChange}
 * />
 */
export const IssueDetailDialog = ({
  open,
  onClose,
  issue,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false,
}: IssueDetailDialogProps) => {
  console.log('[IssueDetailDialog] Dialog open:', open, 'Issue:', issue?.key);

  const handleEdit = () => {
    if (issue) {
      console.log('[IssueDetailDialog] Edit clicked');
      onEdit?.(issue);
    }
  };

  const handleDelete = () => {
    if (issue) {
      console.log('[IssueDetailDialog] Delete clicked');
      onDelete?.(issue);
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<IssueStatus>) => {
    if (issue) {
      const newStatus = e.target.value as IssueStatus;
      console.log('[IssueDetailDialog] Status changed:', newStatus);
      onStatusChange?.(issue, newStatus);
    }
  };

  if (!issue && !isLoading) {
    return null;
  }

  // Check if due date is overdue
  const isDueToday = issue?.dueDate && new Date(issue.dueDate).toDateString() === new Date().toDateString();
  const isOverdue = issue?.dueDate && new Date(issue.dueDate) < new Date() && issue?.status !== 'DONE';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {/* Dialog Title */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {issue && (
            <>
              <Typography variant="caption" color="primary" fontWeight="bold" display="block">
                {issue.key}
              </Typography>
              <Typography variant="h6" component="h2" sx={{ wordBreak: 'break-word' }}>
                {issue.title}
              </Typography>
            </>
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 1 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Dialog Content */}
      <DialogContent sx={{ pt: 3 }}>
        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : issue ? (
          <Box>
            {/* Badges Row */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <IssueTypeBadge type={issue.type} size="medium" />
              <IssuePriorityBadge priority={issue.priority} size="medium" />
              
              {/* Status with Dropdown if onStatusChange provided */}
              {onStatusChange ? (
                <FormControl size="small">
                  <Select
                    value={issue.status}
                    onChange={handleStatusChange}
                    size="small"
                    sx={{
                      height: 32,
                      fontSize: '0.875rem',
                    }}
                  >
                    <MenuItem value="TODO">To Do</MenuItem>
                    <MenuItem value="INPROGRESS">In Progress</MenuItem>
                    <MenuItem value="DONE">Done</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <IssueStatusBadge status={issue.status} size="medium" />
              )}
            </Box>

            {/* Description Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Description
              </Typography>
              {issue.description ? (
                <RichTextDisplay content={issue.description} />
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No description provided
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Details Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Assignee */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Assignee
                </Typography>
                {issue.assignee ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">{issue.assignee.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({issue.assignee.email})
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    Unassigned
                  </Typography>
                )}
              </Box>

              {/* Reporter */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Reporter
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2">{issue.reporter.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({issue.reporter.email})
                  </Typography>
                </Box>
              </Box>

              {/* Due Date */}
              {issue.dueDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Due Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography 
                      variant="body2"
                      color={isOverdue ? 'error' : isDueToday ? 'warning.main' : 'text.primary'}
                      fontWeight={isOverdue || isDueToday ? 600 : 400}
                    >
                      {format(new Date(issue.dueDate), 'MMM dd, yyyy')}
                      {isOverdue && ' (Overdue)'}
                      {isDueToday && ' (Due today)'}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Created */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Created
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({format(new Date(issue.createdAt), 'MMM dd, yyyy HH:mm')})
                  </Typography>
                </Box>
              </Box>

              {/* Updated */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Last Updated
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({format(new Date(issue.updatedAt), 'MMM dd, yyyy HH:mm')})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Box sx={{ flex: 1 }} />
        {issue && onEdit && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
        {issue && onDelete && (
          <Button
            variant="outlined"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{ color: 'error.main', borderColor: 'error.main' }}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IssueDetailDialog;