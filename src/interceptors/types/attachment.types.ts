/**
 * Attachment API Types
 * These types match the backend DTOs exactly
 */

import type { IssueSummary } from './issue.types';
import type { UserSummary } from './project.types';

// ============================================================================
// Response DTOs (Match Backend Exactly)
// ============================================================================

/**
 * Storage type enum (matches backend StorageType)
 */
export type StorageType = 'S3' | 'LOCAL';

/**
 * Attachment response DTO (matches backend AttachmentResponseDTO)
 * Complete attachment information with download URL
 */
export interface AttachmentResponse {
    id: string;
    issue: IssueSummary;
    originalFilename: string;
    filename: string; // Sanitized filename
    fileSize: number; // bytes
    mimeType: string;
    uploadedBy: UserSummary;
    storagePath: string; // Internal S3 key (not exposed to UI)
    storageType: StorageType;
    createdAt: string; // Instant as ISO string
    downloadUrl: string; // Presigned URL (S3: 1hr expiry) or app URL (local)
}

/**
 * Attachment summary DTO (matches backend AttachmentSummaryDTO)
 * Lightweight version for list views
 */
export interface AttachmentSummary {
    id: string;
    originalFilename: string;
    fileSize: number; // bytes
    mimeType: string;
    uploadedBy: UserSummary;
    createdAt: string; // Instant as ISO string
}

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * Upload attachment request
 * Note: Backend uses MultipartFile, frontend uses FormData
 */
export interface UploadAttachmentRequest {
    file: File;
}