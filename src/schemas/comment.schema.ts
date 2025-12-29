import { z } from 'zod';

// ============================================================================
// Create Comment Schema
// ============================================================================

/**
 * Create Comment Schema
 * Matches backend CommentCreateRequestDTO validation
 * 
 * Backend validation rules:
 * - content: required, 1-5000 characters
 */
export const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Comment content is required')
        .max(5000, 'Comment must not exceed 5000 characters'),
});

export type CreateCommentData = z.infer<typeof createCommentSchema>;

// ============================================================================
// Update Comment Schema
// ============================================================================

/**
 * Update Comment Schema
 * Matches backend CommentUpdateRequestDTO validation
 * 
 * Backend validation rules:
 * - content: required, 1-5000 characters
 */
export const updateCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Comment content is required')
        .max(5000, 'Comment must not exceed 5000 characters'),
});

export type UpdateCommentData = z.infer<typeof updateCommentSchema>;
