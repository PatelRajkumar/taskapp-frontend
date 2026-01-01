/**
 * AttachmentList Component
 * List all attachments with pagination and loading states
 */

import { Box, Pagination, Skeleton, Stack, Grid } from '@mui/material';
import { AttachFile, ErrorOutline } from '@mui/icons-material';
import { AttachmentCard } from './AttachmentCard';
import { ErrorState, EmptyState } from '@/components/common';
import type { AttachmentSummary } from '@/interceptors/types/attachment.types';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';

export interface AttachmentListProps {
    /**
     * Issue ID (for context)
     */
    issueId: string;
    /**
     * Attachments to display
     */
    attachments: AttachmentSummary[];
    /**
     * Current user's ID
     */
    currentUserId: string;
    /**
     * Current user's role in project
     */
    userRole: ProjectRole;
    /**
     * Whether currently loading
     */
    isLoading?: boolean;
    /**
     * Error message if any
     */
    error?: string;
    /**
     * Total pages for pagination
     */
    totalPages?: number;
    /**
     * Current page (0-indexed)
     */
    currentPage?: number;
    /**
     * Callback when page changes
     */
    onPageChange?: (page: number) => void;
    /**
     * Callback when download attachment is clicked
     */
    onDownloadAttachment?: (attachmentId: string) => void;
    /**
     * Callback when delete attachment is clicked
     */
    onDeleteAttachment?: (attachmentId: string) => void;
}

/**
 * AttachmentList - Displays list of attachments with pagination
 * 
 * Features:
 * - Grid layout (2 columns on tablet, 1 on mobile)
 * - Loading state (skeleton loaders)
 * - Empty state
 * - Error state with retry
 * - Pagination controls
 * - Newest first sorting (backend default)
 * 
 * @example
 * <AttachmentList
 *   issueId={issueId}
 *   attachments={attachments}
 *   currentUserId={user.id}
 *   userRole={userRole}
 *   isLoading={isLoading}
 *   totalPages={totalPages}
 *   currentPage={currentPage}
 *   onPageChange={handlePageChange}
 *   onDownloadAttachment={handleDownload}
 *   onDeleteAttachment={handleDelete}
 * />
 */
export const AttachmentList = ({
    issueId,
    attachments,
    currentUserId,
    userRole,
    isLoading = false,
    error,
    totalPages = 1,
    currentPage = 0,
    onPageChange,
    onDownloadAttachment,
    onDeleteAttachment,
}: AttachmentListProps) => {
    console.log('[AttachmentList] Rendering with', attachments.length, 'attachments, page:', currentPage);

    // Loading State
    if (isLoading) {
        console.log('[AttachmentList] Showing loading state');
        return (
            <Grid container spacing={2}>
                {[...Array(4)].map((_, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                        <Box
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                display: 'flex',
                                gap: 2,
                            }}
                        >
                            <Skeleton variant="rectangular" width={48} height={48} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="60%" />
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    }

    // Error State
    if (error) {
        console.error('[AttachmentList] Error:', error);
        return (
            <ErrorState
                icon={<ErrorOutline />}
                title="Failed to load attachments"
                description={error}
            />
        );
    }

    // Empty State
    if (attachments.length === 0) {
        console.log('[AttachmentList] No attachments to display');
        return (
            <EmptyState
                icon={<AttachFile />}
                title="No attachments yet"
                description="Upload files to attach them to this issue"
            />
        );
    }

    // Attachment List
    return (
        <Box>
            {/* Attachments Grid */}
            <Grid container spacing={2}>
                {attachments.map((attachment) => (
                    <Grid size={{ xs: 12, md: 6 }} key={attachment.id}>
                        <AttachmentCard
                            attachment={attachment}
                            currentUserId={currentUserId}
                            userRole={userRole}
                            onDownload={onDownloadAttachment}
                            onDelete={onDeleteAttachment}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1} // MUI Pagination is 1-indexed
                        onChange={(_, page) => {
                            console.log('[AttachmentList] Page changed to:', page - 1);
                            onPageChange?.(page - 1); // Convert back to 0-indexed
                        }}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default AttachmentList;