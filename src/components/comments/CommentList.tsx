/**
 * CommentList Component
 * List all comments with pagination and loading states
 */

import { Box, Pagination, Skeleton, Stack, Button } from '@mui/material';
import { CommentOutlined, ErrorOutline } from '@mui/icons-material';
import { CommentCard } from './CommentCard';
import { ErrorState, EmptyState } from '@/components/common';
import type { CommentSummary } from '@/interceptors/types/comment.types';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';

export interface CommentListProps {
    /**
     * Issue ID (for context)
     */
    issueId: string;
    /**
     * Comments to display
     */
    comments: CommentSummary[];
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
     * Callback when edit comment is clicked
     */
    onEditComment?: (comment: CommentSummary) => void;
    /**
     * Callback when delete comment is clicked
     */
    onDeleteComment?: (commentId: string) => void;
}

/**
 * CommentList - Displays list of comments with pagination
 * 
 * Features:
 * - Loading state (skeleton loaders)
 * - Empty state
 * - Error state with retry
 * - Pagination controls
 * - Newest first sorting (backend default)
 * 
 * @example
 * <CommentList
 *   issueId={issueId}
 *   comments={comments}
 *   currentUserId={user.id}
 *   userRole={userRole}
 *   isLoading={isLoading}
 *   totalPages={totalPages}
 *   currentPage={currentPage}
 *   onPageChange={handlePageChange}
 *   onEditComment={handleEdit}
 *   onDeleteComment={handleDelete}
 * />
 */
export const CommentList = ({
    issueId,
    comments,
    currentUserId,
    userRole,
    isLoading = false,
    error,
    totalPages = 1,
    currentPage = 0,
    onPageChange,
    onEditComment,
    onDeleteComment,
}: CommentListProps) => {
    console.log('[CommentList] Rendering with', comments.length, 'comments, page:', currentPage);

    // Loading State
    if (isLoading) {
        console.log('[CommentList] Showing loading state');
        return (
            <Stack spacing={2}>
                {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="30%" />
                            <Skeleton variant="text" width="100%" />
                            <Skeleton variant="text" width="80%" />
                        </Box>
                    </Box>
                ))}
            </Stack>
        );
    }

    // Error State
    if (error) {
        console.error('[CommentList] Error:', error);
        return (
            <ErrorState
                icon={<ErrorOutline />}
                title="Failed to load comments"
                description={error}
                action={<Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>}
            />
        );
    }

    // Empty State
    if (comments.length === 0) {
        console.log('[CommentList] No comments to display');
        return (
            <EmptyState
                icon={<CommentOutlined />}
                title="No comments yet"
                description="Be the first to comment!"
            />
        );
    }

    // Comment List
    return (
        <Box>
            {/* Comments */}
            <Stack spacing={2}>
                {comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        issueId={issueId}
                        currentUserId={currentUserId}
                        userRole={userRole}
                        onEdit={onEditComment}
                        onDelete={onDeleteComment}
                    />
                ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1} // MUI Pagination is 1-indexed
                        onChange={(_, page) => {
                            console.log('[CommentList] Page changed to:', page - 1);
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

export default CommentList;