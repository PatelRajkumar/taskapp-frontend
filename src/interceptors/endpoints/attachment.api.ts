/**
 * Attachment API Endpoints
 * All functions for interacting with attachment endpoints
 * 
 * Endpoints:
 * - POST /api/issues/{issueId}/attachments - Upload attachment
 * - GET /api/issues/{issueId}/attachments - List attachments (paginated)
 * - GET /api/attachments/{attachmentId} - Get attachment details
 * - GET /api/attachments/{attachmentId}/download - Generate download URL
 * - DELETE /api/attachments/{attachmentId} - Delete attachment (soft delete)
 */

import apiClient, { isAxiosError } from '@/api/client';
import type { ApiErrorResponse } from '../types/auth.types';
import type { PageResponse, PageableRequest } from '../types/project.types';
import type {
    AttachmentResponse,
    AttachmentSummary,
    UploadAttachmentRequest,
} from '../types/attachment.types';

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        if (data?.message) {
            return data.message;
        }

        if (data?.details) {
            const fieldErrors = Object.values(data.details).join(', ');
            return fieldErrors || 'Validation error occurred';
        }

        // Attachment-specific error codes
        if (error.response?.status === 400) {
            return 'Invalid file. Please check file size and type.';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to perform this action';
        }

        if (error.response?.status === 404) {
            return 'Attachment not found';
        }

        if (error.response?.status === 410) {
            return 'This attachment has been deleted';
        }

        if (error.response?.status === 500) {
            return 'Server error. Please try again later';
        }

        if (error.message === 'Network Error') {
            return 'Unable to connect to server';
        }
    }

    return 'An unexpected error occurred';
};

// ============================================================================
// Attachment Operations
// ============================================================================

/**
 * Upload an attachment to an issue
 * POST /api/issues/{issueId}/attachments
 * 
 * File constraints:
 * - Max size: 50MB
 * - Allowed types: images, PDFs, documents (Word, Excel), text files
 * 
 * @param issueId - Issue UUID
 * @param file - File to upload
 * @param onUploadProgress - Optional progress callback
 * @returns Attachment details with download URL
 * 
 * @example
 * const attachment = await uploadAttachment(issueId, file, (progress) => {
 *   console.log(`Upload ${progress}% complete`);
 * });
 */
export const uploadAttachment = async (
    issueId: string,
    file: File,
    onUploadProgress?: (progressPercent: number) => void
): Promise<AttachmentResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        console.log('[attachment.api] Uploading file:', file.name, 'to issue:', issueId);

        const response = await apiClient.post<AttachmentResponse>(
            `/issues/${issueId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: onUploadProgress
                    ? (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onUploadProgress(percentCompleted);
                        }
                    }
                    : undefined,
            }
        );

        console.log('[attachment.api] Upload successful:', response.data.id);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Upload failed:', message);
        throw new Error(message);
    }
};

/**
 * Get all attachments for an issue (paginated)
 * GET /api/issues/{issueId}/attachments
 * 
 * Default sort: createdAt DESC (newest first)
 * 
 * @param issueId - Issue UUID
 * @param params - Pagination parameters (page, size, sort)
 * @returns Paginated attachment list
 * 
 * @example
 * const page = await getIssueAttachments(issueId, { page: 0, size: 10 });
 * console.log(page.content); // Array of attachments
 * console.log(page.totalElements); // Total count
 */
export const getIssueAttachments = async (
    issueId: string,
    params?: PageableRequest
): Promise<PageResponse<AttachmentSummary>> => {
    try {
        console.log('[attachment.api] Fetching attachments for issue:', issueId, params);

        const response = await apiClient.get<PageResponse<AttachmentSummary>>(
            `/issues/${issueId}/attachments`,
            { params }
        );

        console.log('[attachment.api] Found', response.data.totalElements, 'attachments');
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Failed to fetch attachments:', message);
        throw new Error(message);
    }
};

/**
 * Get attachment details with download URL
 * GET /api/attachments/{attachmentId}
 * 
 * Download URL is temporary:
 * - S3: Presigned URL, valid for 1 hour
 * - Local: Application URL, always valid
 * 
 * @param attachmentId - Attachment UUID
 * @returns Attachment details with fresh download URL
 * 
 * @example
 * const attachment = await getAttachment(attachmentId);
 * window.open(attachment.downloadUrl, '_blank'); // Download file
 */
export const getAttachment = async (
    attachmentId: string
): Promise<AttachmentResponse> => {
    try {
        console.log('[attachment.api] Fetching attachment:', attachmentId);

        const response = await apiClient.get<AttachmentResponse>(
            `/attachments/${attachmentId}`
        );

        console.log('[attachment.api] Attachment retrieved:', response.data.originalFilename);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Failed to fetch attachment:', message);
        throw new Error(message);
    }
};

/**
 * Generate a fresh download URL for an attachment
 * GET /api/attachments/{attachmentId}/download
 * 
 * Returns plain text URL (not JSON)
 * 
 * Use case: Regenerate URL if presigned URL expired
 * 
 * @param attachmentId - Attachment UUID
 * @returns Download URL as plain text
 * 
 * @example
 * const url = await generateDownloadUrl(attachmentId);
 * window.open(url, '_blank');
 */
export const generateDownloadUrl = async (
    attachmentId: string
): Promise<string> => {
    try {
        console.log('[attachment.api] Generating download URL for:', attachmentId);

        const response = await apiClient.get<string>(
            `/attachments/${attachmentId}/download`,
            {
                // Response is plain text, not JSON
                transformResponse: [(data) => data],
            }
        );

        console.log('[attachment.api] Download URL generated');
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Failed to generate download URL:', message);
        throw new Error(message);
    }
};

/**
 * Delete an attachment (soft delete)
 * DELETE /api/attachments/{attachmentId}
 * 
 * Authorization: Only uploader can delete their own attachments
 * 
 * Note: Physical file is NOT deleted from storage (audit trail)
 * 
 * @param attachmentId - Attachment UUID
 * @returns void (204 No Content)
 * 
 * @example
 * await deleteAttachment(attachmentId);
 * console.log('Attachment deleted');
 */
export const deleteAttachment = async (attachmentId: string): Promise<void> => {
    try {
        console.log('[attachment.api] Deleting attachment:', attachmentId);

        await apiClient.delete<void>(`/attachments/${attachmentId}`);

        console.log('[attachment.api] Attachment deleted successfully');
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Failed to delete attachment:', message);
        throw new Error(message);
    }
};

/**
 * Get attachment count for an issue
 * Convenience function to get count without pagination
 * 
 * Note: Backend doesn't have dedicated count endpoint,
 * so we fetch first page and use totalElements
 * 
 * @param issueId - Issue UUID
 * @returns Total number of attachments
 * 
 * @example
 * const count = await getAttachmentCount(issueId);
 * console.log(`${count} files attached`);
 */
export const getAttachmentCount = async (issueId: string): Promise<number> => {
    try {
        console.log('[attachment.api] Getting attachment count for issue:', issueId);

        const response = await apiClient.get<PageResponse<AttachmentSummary>>(
            `/issues/${issueId}/attachments`,
            { params: { page: 0, size: 1 } } // Only fetch first page for count
        );

        const count = response.data.totalElements;
        console.log('[attachment.api] Attachment count:', count);
        return count;
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('[attachment.api] Failed to get attachment count:', message);
        throw new Error(message);
    }
};