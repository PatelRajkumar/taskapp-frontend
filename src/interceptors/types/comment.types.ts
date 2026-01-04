/**
 * Comment API Types
 * These types match the backend DTOs exactly
 */

import type { IssueSummary } from "./issue.types";
import type { UserSummary } from "./project.types";

// ============================================================================
// Response DTOs (Match Backend Exactly)
// ============================================================================

/**
 * Comment response DTO (matches backend CommentResponseDTO)
 * Complete comment information with author and timestamps
 */
export interface CommentResponse {
    id: string;
    content: string; // Comment text content
    issue: IssueSummary;
    author: UserSummary;
    createdAt: string; // Instant as ISO string
    updatedAt: string; // Instant as ISO string
}

export interface CreateCommentRequest {
    content: string;
}

export interface UpdateCommentRequest {
    content: string;
}

export interface CommentSummary {
    id: string;
    content: string;
    author: UserSummary;
    createdAt: string; // Instant as ISO string
    updatedAt: string; // Instant as ISO string
}