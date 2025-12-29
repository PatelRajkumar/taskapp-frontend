/**
 * CommentForm Component
 * Form for creating or editing comments
 */

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import { Button, Input } from '@/components/common';
import { createCommentSchema, updateCommentSchema } from '@/schemas/comment.schema';
import type { CreateCommentData, UpdateCommentData } from '@/schemas/comment.schema';
import type { CommentSummary } from '@/interceptors/types/comment.types';

/**
 * Discriminated union for form modes
 * Ensures type safety - edit mode MUST have comment
 */
type CommentFormProps =
    | {
        mode: 'create';
        comment?: never;
        issueId: string;
        onSubmit: (data: CreateCommentData) => void | Promise<void>;
        onCancel?: () => void;
        isSubmitting?: boolean;
    }
    | {
        mode: 'edit';
        comment: CommentSummary;
        issueId: string;
        onSubmit: (data: UpdateCommentData) => void | Promise<void>;
        onCancel: () => void;
        isSubmitting?: boolean;
    };

/**
 * CommentForm - Create or edit comment
 * 
 * Features:
 * - Plain text textarea (no rich text - backend constraint)
 * - Character counter (0/5000)
 * - Auto-focus on mount
 * - Validation with Zod
 * - Cancel/Submit buttons
 * - Loading state
 * 
 * Modes:
 * - create: Empty form, optional cancel
 * - edit: Pre-filled, required cancel
 * 
 * @example
 * // Create mode
 * <CommentForm
 *   mode="create"
 *   issueId={issueId}
 *   onSubmit={handleCreate}
 *   isSubmitting={isCreating}
 * />
 * 
 * // Edit mode
 * <CommentForm
 *   mode="edit"
 *   comment={comment}
 *   issueId={issueId}
 *   onSubmit={handleUpdate}
 *   onCancel={handleCancelEdit}
 *   isSubmitting={isUpdating}
 * />
 */
export const CommentForm = (props: CommentFormProps) => {
    const { mode, issueId, onSubmit, onCancel, isSubmitting = false } = props;
    const comment = props.mode === 'edit' ? props.comment : undefined;

    console.log('[CommentForm] Rendering in', mode, 'mode');

    // Select schema based on mode
    const schema = mode === 'create' ? createCommentSchema : updateCommentSchema;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<CreateCommentData | UpdateCommentData>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: comment?.content || '',
        },
    });

    // Watch content for character counter
    const content = watch('content');
    const contentLength = content?.length || 0;

    // Reset form when comment changes (edit mode)
    useEffect(() => {
        if (mode === 'edit' && comment) {
            console.log('[CommentForm] Resetting form with comment:', comment.id);
            reset({ content: comment.content });
        }
    }, [mode, comment, reset]);

    const handleFormSubmit = async (data: CreateCommentData | UpdateCommentData) => {
        console.log('[CommentForm] Submitting in', mode, 'mode:', data);
        try {
            await onSubmit(data);

            // Clear form after successful create
            if (mode === 'create') {
                console.log('[CommentForm] Clearing form after create');
                reset({ content: '' });
            }
        } catch (error) {
            console.error('[CommentForm] Submit error:', error);
        }
    };

    const handleCancel = () => {
        console.log('[CommentForm] Cancel clicked');
        if (mode === 'create') {
            // Clear form
            reset({ content: '' });
        }
        onCancel?.();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{ width: '100%' }}
        >
            {/* Textarea */}
            <Controller
                name="content"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        multiline
                        rows={4}
                        placeholder={
                            mode === 'create'
                                ? 'Write a comment...'
                                : 'Edit your comment...'
                        }
                        error={!!errors.content}
                        helperText={errors.content?.message}
                        disabled={isSubmitting}
                        autoFocus
                        sx={{ mb: 1 }}
                    />
                )}
            />

            {/* Character Counter */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                    variant="caption"
                    color={contentLength > 5000 ? 'error' : 'text.secondary'}
                >
                    {contentLength} / 5000 characters
                </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {(mode === 'edit' || onCancel) && (
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || contentLength === 0 || contentLength > 5000}
                >
                    {isSubmitting
                        ? mode === 'create'
                            ? 'Adding...'
                            : 'Updating...'
                        : mode === 'create'
                            ? 'Add Comment'
                            : 'Update Comment'}
                </Button>
            </Box>
        </Box>
    );
};

export default CommentForm;