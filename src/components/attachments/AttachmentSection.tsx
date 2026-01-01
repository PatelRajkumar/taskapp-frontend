/**
 * AttachmentSection Component
 * Main container for attachments in Issue Detail Dialog
 */

import { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import { Button } from '@/components/common';
import { AttachmentList } from './AttachmentList';
import { AttachmentUpload } from './AttachmentUpload';
import { useIssueAttachments, useAttachmentCount } from '@/hooks/useAttachments';
import {
    useUploadAttachment,
    useDeleteAttachment,
} from '@/hooks/useAttachmentMutations';
import { useAuth } from '@/hooks/useAuth';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';
import toast from 'react-hot-toast';

export interface AttachmentSectionProps {
    /**
     * Issue ID
     */
    issueId: string;
    /**
     * Project ID (for permission context)
     */
    projectId: string;
    /**
     * Current user's role in project
     */
    userRole: ProjectRole;
}

/**
 * AttachmentSection - Main attachments container
 * 
 * Features:
 * - Attachment count header
 * - Upload zone (always visible at top)
 * - Attachment list with pagination
 * - Delete confirmation dialog
 * - Permission checks
 * - Download URL generation
 * 
 * Layout:
 * ┌─────────────────────────────────┐
 * │ 3 Attachments                  │
 * ├─────────────────────────────────┤
 * │ [Upload Zone]                  │
 * ├─────────────────────────────────┤
 * │ [Attachment 1] [Attachment 2]  │
 * │ [Attachment 3] [Attachment 4]  │
 * │ [Pagination]                   │
 * └─────────────────────────────────┘
 * 
 * @example
 * <AttachmentSection
 *   issueId={issue.id}
 *   projectId={issue.project.id}
 *   userRole={userRole}
 * />
 */
export const AttachmentSection = ({
    issueId,
    projectId,
    userRole,
}: AttachmentSectionProps) => {
    const { user } = useAuth();
    const [page, setPage] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const pageSize = 10;

    // Delete confirmation state
    const [deletingAttachmentId, setDeletingAttachmentId] = useState<string | null>(null);

    console.log('[AttachmentSection] Rendering for issue:', issueId, 'page:', page);

    // Queries
    const { data: attachmentsPage, isLoading: isLoadingAttachments, error: attachmentsError } =
        useIssueAttachments(issueId, { page, size: pageSize });

    const { data: attachmentCount } = useAttachmentCount(issueId);

    // Mutations
    const { mutate: uploadAttachment, isPending: isUploading } = useUploadAttachment(issueId, {
        onProgress: (percent) => {
            console.log('[AttachmentSection] Upload progress:', percent);
            setUploadProgress(percent);
        },
        onSuccess: (data) => {
            console.log('[AttachmentSection] Upload successful:', data.originalFilename);
            setUploadProgress(0);
        },
        onError: (error) => {
            console.error('[AttachmentSection] Upload failed:', error.message);
            setUploadProgress(0);
        },
    });

    const { mutate: deleteAttachment, isPending: isDeleting } = useDeleteAttachment(issueId, {
        onSuccess: () => {
            console.log('[AttachmentSection] Attachment deleted successfully');
            setDeletingAttachmentId(null);

            // If we deleted the last attachment on the page, go to previous page
            if (attachments.length === 1 && page > 0) {
                setPage(page - 1);
            }
        },
    });

    // Extract data from page response
    const attachments = attachmentsPage?.content || [];
    const totalPages = attachmentsPage?.totalPages || 1;

    // Handlers
    const handleFileSelect = (file: File) => {
        console.log('[AttachmentSection] File selected for upload:', file.name);
        uploadAttachment(file);
    };

    const handleDownloadAttachment = (attachmentId: string) => {
        console.log('[AttachmentSection] Download attachment:', attachmentId);

        // Generate download URL and open in new tab
        // Note: The attachment already has a download URL in the full response
        // For simplicity, we'll fetch the attachment detail which includes the URL
        import('@/interceptors').then(({ getAttachment }) => {
            getAttachment(attachmentId)
                .then((attachment) => {
                    console.log('[AttachmentSection] Opening download URL');
                    window.open(attachment.downloadUrl, '_blank');
                })
                .catch((error) => {
                    console.error('[AttachmentSection] Failed to get download URL:', error);
                    toast.error('Failed to download file');
                });
        });
    };

    const handleDeleteClick = (attachmentId: string) => {
        console.log('[AttachmentSection] Delete clicked for:', attachmentId);
        setDeletingAttachmentId(attachmentId);
    };

    const handleConfirmDelete = () => {
        if (!deletingAttachmentId) return;

        console.log('[AttachmentSection] Confirming delete for:', deletingAttachmentId);
        deleteAttachment(deletingAttachmentId);
    };

    const handleCancelDelete = () => {
        console.log('[AttachmentSection] Canceling delete');
        setDeletingAttachmentId(null);
    };

    const handlePageChange = (newPage: number) => {
        console.log('[AttachmentSection] Page changed to:', newPage);
        setPage(newPage);
    };

    if (!user) {
        console.error('[AttachmentSection] No user found');
        return null;
    }

    // Permission check: All project members can upload attachments
    const canUploadAttachment = userRole === 'OWNER' || userRole === 'ADMIN' || userRole === 'MEMBER';

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AttachFile color="action" />
                <Typography variant="h6">
                    {attachmentCount !== undefined
                        ? `${attachmentCount} ${attachmentCount === 1 ? 'Attachment' : 'Attachments'}`
                        : 'Attachments'}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Upload Zone */}
            {canUploadAttachment && (
                <Box sx={{ mb: 3 }}>
                    <AttachmentUpload
                        issueId={issueId}
                        onFileSelect={handleFileSelect}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                    />
                </Box>
            )}

            {/* Read-only message for users without upload permission (if needed) */}
            {!canUploadAttachment && (
                <Box
                    sx={{
                        mb: 3,
                        p: 2,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        You have view-only access to attachments
                    </Typography>
                </Box>
            )}

            {/* Attachment List */}
            <AttachmentList
                issueId={issueId}
                attachments={attachments}
                currentUserId={user.id}
                userRole={userRole}
                isLoading={isLoadingAttachments}
                error={attachmentsError?.message}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
                onDownloadAttachment={handleDownloadAttachment}
                onDeleteAttachment={handleDeleteClick}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingAttachmentId}
                onClose={handleCancelDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Attachment?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this attachment? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={handleCancelDelete} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmDelete}
                        loading={isDeleting}
                        sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AttachmentSection;