/**
 * CommentCard Component
 * Displays a single comment with actions
 */

import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Paper,
} from '@mui/material';
import {
    MoreVert,
    Edit,
    Delete,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/profile';
import type { CommentSummary } from '@/interceptors/types/comment.types';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';

export interface CommentCardProps {
    /**
     * Comment data to display
     */
    comment: CommentSummary;
    /**
     * Issue ID (for context)
     */
    issueId: string;
    /**
     * Current user's ID
     */
    currentUserId: string;
    /**
     * Current user's role in project
     */
    userRole: ProjectRole;
    /**
     * Callback when edit is clicked
     */
    onEdit?: (comment: CommentSummary) => void;
    /**
     * Callback when delete is clicked
     */
    onDelete?: (commentId: string) => void;
    /**
     * Whether to show action menu
     * @default true
     */
    showActions?: boolean;
}

/**
 * CommentCard - Displays comment information
 * 
 * Features:
 * - Author avatar and name
 * - Comment content (plain text, word-wrapped)
 * - Timestamp with "edited" indicator
 * - Edit/Delete actions menu (permission-based)
 * - Responsive layout
 * 
 * Permissions:
 * - Edit/Delete: Comment author OR project OWNER/ADMIN
 * 
 * @example
 * <CommentCard
 *   comment={comment}
 *   issueId={issue.id}
 *   currentUserId={user.id}
 *   userRole={userRole}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
export const CommentCard = ({
    comment,
    issueId,
    currentUserId,
    userRole,
    onEdit,
    onDelete,
    showActions = true,
}: CommentCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    console.log('[CommentCard] Rendering comment:', comment.id, 'by:', comment.author.name);

    // Calculate if comment has been edited
    const isEdited = comment.updatedAt !== comment.createdAt;

    // Permission check: Can edit/delete if author OR OWNER/ADMIN
    const canModify =
        comment.author.id === currentUserId ||
        userRole === 'OWNER' ||
        userRole === 'ADMIN';

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        console.log('[CommentCard] Menu opened for comment:', comment.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        console.log('[CommentCard] Edit clicked for comment:', comment.id);
        handleMenuClose();
        onEdit?.(comment);
    };

    const handleDelete = () => {
        console.log('[CommentCard] Delete clicked for comment:', comment.id);
        handleMenuClose();
        onDelete?.(comment.id);
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}
        >
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Avatar */}
                <Avatar
                    name={comment.author.name}
                    src={comment.author.avatarUrl}
                    size="small"
                />

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header: Author + Timestamp */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" fontWeight={600}>
                            {comment.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Typography>
                        {isEdited && (
                            <Chip
                                label="Edited"
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.6875rem' }}
                            />
                        )}
                        {/* Spacer */}
                        <Box sx={{ flex: 1 }} />
                        {/* Actions Menu */}
                        {showActions && canModify && (onEdit || onDelete) && (
                            <IconButton
                                size="small"
                                onClick={handleMenuOpen}
                                sx={{ ml: 'auto' }}
                            >
                                <MoreVert fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    {/* Comment Content */}
                    <Typography
                        variant="body2"
                        sx={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {comment.content}
                    </Typography>
                </Box>
            </Box>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
            >
                {onEdit && (
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit Comment</ListItemText>
                    </MenuItem>
                )}

                {onDelete && (
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <Delete fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete Comment</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </Paper>
    );
};

export default CommentCard;