/**
 * CommentSection Component
 * Main container for comments in Issue Detail Dialog
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
import { CommentOutlined } from '@mui/icons-material';
import { Button } from '@/components/common';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useIssueComments, useCommentCount } from '@/hooks/useComments';
import {
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
} from '@/hooks/useCommentMutations';
import { useAuth } from '@/hooks/useAuth';
import type { CommentSummary } from '@/interceptors/types/comment.types';
import type { CreateCommentData, UpdateCommentData } from '@/schemas/comment.schema';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';
import toast from 'react-hot-toast';

export interface CommentSectionProps {
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
 * CommentSection - Main comments container
 * 
 * Features:
 * - Comment count header
 * - Create form (always visible at top)
 * - Comment list with pagination
 * - Edit mode (replaces create form)
 * - Delete confirmation dialog
 * - Permission checks
 * 
 * Layout:
 * ┌─────────────────────────────────┐
 * │ 3 Comments                     │
 * ├─────────────────────────────────┤
 * │ [Create Comment Form]          │
 * ├─────────────────────────────────┤
 * │ [Comment 1]                    │
 * │ [Comment 2]                    │
 * │ [Comment 3]                    │
 * │ [Pagination]                   │
 * └─────────────────────────────────┘
 * 
 * @example
 * <CommentSection
 *   issueId={issue.id}
 *   projectId={issue.project.id}
 *   userRole={userRole}
 * />
 */
export const CommentSection = ({
    issueId,
    projectId,
    userRole,
}: CommentSectionProps) => {
    const { user } = useAuth();
    const [page, setPage] = useState(0);
    const pageSize = 20;

    // Editing state
    const [editingComment, setEditingComment] = useState<CommentSummary | null>(null);

    // Delete confirmation state
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    console.log('[CommentSection] Rendering for issue:', issueId, 'page:', page);

    // Queries
    const { data: commentsPage, isLoading: isLoadingComments, error: commentsError } = useIssueComments(
        issueId,
        { page, size: pageSize },
        !!issueId
    );

    const { data: commentCount } = useCommentCount(issueId);

    const comments = commentsPage?.content || [];
    const totalPages = commentsPage?.totalPages || 0;

    // Mutations
    const { mutate: createComment, isPending: isCreating } = useCreateComment(issueId, {
        onSuccess: () => {
            console.log('[CommentSection] Comment created successfully');
            // Stay on current page (or reset to first if desired)
        },
    });

    const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
        issueId,
        editingComment?.id ?? '',
        {
            onSuccess: () => {
                console.log('[CommentSection] Comment updated successfully');
                setEditingComment(null);
            },
        }
    );

    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(issueId, {
        onSuccess: () => {
            console.log('[CommentSection] Comment deleted successfully');
            setDeletingCommentId(null);

            // If we deleted the last comment on the page, go to previous page
            if (comments.length === 1 && page > 0) {
                setPage(page - 1);
            }
        },
    });

    // Handlers
    const handleCreateComment = (data: CreateCommentData) => {
        console.log('[CommentSection] Creating comment:', data);
        createComment(data);
    };

    const handleEditComment = (comment: CommentSummary) => {
        console.log('[CommentSection] Editing comment:', comment.id);
        setEditingComment(comment);
    };

    const handleUpdateComment = (data: UpdateCommentData) => {
        if (!editingComment) return;

        console.log('[CommentSection] Updating comment:', editingComment.id, data);
        updateComment(data);
    };

    const handleCancelEdit = () => {
        console.log('[CommentSection] Canceling edit');
        setEditingComment(null);
    };

    const handleDeleteClick = (commentId: string) => {
        console.log('[CommentSection] Delete clicked for:', commentId);
        setDeletingCommentId(commentId);
    };

    const handleConfirmDelete = () => {
        if (!deletingCommentId) return;

        console.log('[CommentSection] Confirming delete for:', deletingCommentId);
        deleteComment(deletingCommentId);
    };

    const handleCancelDelete = () => {
        console.log('[CommentSection] Canceling delete');
        setDeletingCommentId(null);
    };

    const handlePageChange = (newPage: number) => {
        console.log('[CommentSection] Page changed to:', newPage);
        setPage(newPage);
        setEditingComment(null); // Clear edit mode on page change
    };

    if (!user) {
        console.error('[CommentSection] No user found');
        return null;
    }

    // Permission check: OWNER/ADMIN/MEMBER can create comments, VIEWER cannot
    const canCreateComment =
        userRole === 'OWNER' ||
        userRole === 'ADMIN' ||
        userRole === 'MEMBER';

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CommentOutlined color="action" />
                <Typography variant="h6">
                    {commentCount !== undefined ? `${commentCount} ${commentCount === 1 ? 'Comment' : 'Comments'}` : 'Comments'}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Create Form (hidden when editing or no permission) */}
            {!editingComment && canCreateComment && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <CommentForm
                        mode="create"
                        issueId={issueId}
                        onSubmit={handleCreateComment}
                        isSubmitting={isCreating}
                    />
                </Box>
            )}

            {/* Read-only message for viewers */}
            {!editingComment && !canCreateComment && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        You have view-only access to comments
                    </Typography>
                </Box>
            )}

            {/* Edit Form (replaces create form) */}
            {editingComment && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Editing Comment
                    </Typography>
                    <CommentForm
                        mode="edit"
                        comment={editingComment}
                        issueId={issueId}
                        onSubmit={handleUpdateComment}
                        onCancel={handleCancelEdit}
                        isSubmitting={isUpdating}
                    />
                </Box>
            )}

            {/* Comment List */}
            <CommentList
                issueId={issueId}
                comments={comments}
                currentUserId={user.id}
                userRole={userRole}
                isLoading={isLoadingComments}
                error={commentsError?.message}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteClick}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingCommentId}
                onClose={handleCancelDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Comment?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancelDelete}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        sx={{
                            bgcolor: 'error.main',
                            '&:hover': {
                                bgcolor: 'error.dark',
                            },
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentSection;