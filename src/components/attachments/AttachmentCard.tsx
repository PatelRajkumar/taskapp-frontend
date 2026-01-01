/**
 * AttachmentCard Component
 * Displays a single attachment with actions
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
    Paper,
    Chip,
} from '@mui/material';
import {
    MoreVert,
    Download,
    Delete,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/profile';
import { AttachmentFileIcon } from './AttachmentFileIcon';
import { formatFileSize } from '@/schemas/attachment.schema';
import type { AttachmentSummary } from '@/interceptors/types/attachment.types';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';

export interface AttachmentCardProps {
    /**
     * Attachment data to display
     */
    attachment: AttachmentSummary;
    /**
     * Current user's ID
     */
    currentUserId: string;
    /**
     * Current user's role in project
     */
    userRole: ProjectRole;
    /**
     * Callback when download is clicked
     */
    onDownload?: (attachmentId: string) => void;
    /**
     * Callback when delete is clicked
     */
    onDelete?: (attachmentId: string) => void;
    /**
     * Whether to show action menu
     * @default true
     */
    showActions?: boolean;
}

/**
 * AttachmentCard - Displays attachment information
 * 
 * Features:
 * - File icon based on MIME type
 * - Filename, file size, upload date
 * - Uploader avatar and name
 * - Download/Delete actions menu (permission-based)
 * - Responsive layout
 * 
 * Permissions:
 * - Download: All project members
 * - Delete: Uploader OR project OWNER/ADMIN
 * 
 * @example
 * <AttachmentCard
 *   attachment={attachment}
 *   currentUserId={user.id}
 *   userRole={userRole}
 *   onDownload={handleDownload}
 *   onDelete={handleDelete}
 * />
 */
export const AttachmentCard = ({
    attachment,
    currentUserId,
    userRole,
    onDownload,
    onDelete,
    showActions = true,
}: AttachmentCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    console.log('[AttachmentCard] Rendering attachment:', attachment.id, attachment.originalFilename);

    // Permission checks
    // OWNER/ADMIN can delete all attachments
    // Uploader can delete their own attachments
    // All members can download
    const canDelete =
        userRole === 'OWNER' ||
        userRole === 'ADMIN' ||
        attachment.uploadedBy.id === currentUserId;

    const showActionsMenu = showActions && (onDownload || (onDelete && canDelete));

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        console.log('[AttachmentCard] Menu opened for attachment:', attachment.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownload = () => {
        console.log('[AttachmentCard] Download clicked for attachment:', attachment.id);
        handleMenuClose();
        onDownload?.(attachment.id);
    };

    const handleDelete = () => {
        console.log('[AttachmentCard] Delete clicked for attachment:', attachment.id);
        handleMenuClose();
        onDelete?.(attachment.id);
    };

    const uploadedTimeAgo = formatDistanceToNow(new Date(attachment.createdAt), {
        addSuffix: true,
    });

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 3,
                },
            }}
        >
            {/* File Icon */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                }}
            >
                <AttachmentFileIcon
                    mimeType={attachment.mimeType}
                    fontSize="large"
                    color="action"
                />
            </Box>

            {/* File Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Filename */}
                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={attachment.originalFilename}
                >
                    {attachment.originalFilename}
                </Typography>

                {/* File Size */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatFileSize(attachment.fileSize)}
                </Typography>

                {/* Uploader Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Avatar
                        name={attachment.uploadedBy.name}
                        size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                        {attachment.uploadedBy.name} · {uploadedTimeAgo}
                    </Typography>
                </Box>
            </Box>

            {/* Actions Menu */}
            {showActionsMenu && (
                <>
                    <IconButton
                        size="small"
                        onClick={handleMenuOpen}
                        aria-label="attachment actions"
                    >
                        <MoreVert />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                    >
                        {onDownload && (
                            <MenuItem onClick={handleDownload}>
                                <ListItemIcon>
                                    <Download fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Download</ListItemText>
                            </MenuItem>
                        )}

                        {onDelete && canDelete && (
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <ListItemIcon>
                                    <Delete fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        )}
                    </Menu>
                </>
            )}
        </Paper>
    );
};

export default AttachmentCard;