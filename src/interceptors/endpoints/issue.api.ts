/**
 * Issue API Endpoints
 * All functions for interacting with issue endpoints
 * 
 * Endpoints:
 * - Project-scoped: /api/projects/{projectId}/issues
 * - Global: /api/issues
 */

import apiClient, { isAxiosError } from '@/api/client';
import type { ApiErrorResponse } from '../types/auth.types';
import type { PageResponse } from '../types/project.types';
import type {
    IssueResponse,
    IssueSummary,
    IssueHistoryResponse,
    CreateIssueRequest,
    UpdateIssueRequest,
    UpdateIssueStatusRequest,
    AssignIssueRequest,
    IssueFilterParams,
    IssueSearchParams,
    OverdueIssuesParams,
} from '../types/issue.types';

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: any): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        if (data?.message) {
            return data.message;
        }

        if (data?.details) {
            const fieldErrors = Object.values(data.details).join(', ');
            return fieldErrors || 'Validation error occurred';
        }

        // Issue-specific error codes
        if (error.response?.status === 400) {
            return 'Invalid issue data';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to perform this action';
        }

        if (error.response?.status === 404) {
            return 'Issue not found';
        }

        if (error.response?.status === 409) {
            return 'Issue conflict occurred';
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
// Project-Scoped Issue Operations
// ============================================================================

/**
 * Create a new issue in a project
 * POST /api/projects/{projectId}/issues
 * 
 * @param projectId - Project UUID
 * @param data - Issue creation data
 * @returns Created issue
 */
export const createIssue = async (
    projectId: string,
    data: CreateIssueRequest
): Promise<IssueResponse> => {
    try {
        const response = await apiClient.post<IssueResponse>(
            `/projects/${projectId}/issues`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get all issues in a project (paginated)
 * GET /api/projects/{projectId}/issues
 * 
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @returns Paginated issue list
 */
export const getProjectIssues = async (
    projectId: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            `/projects/${projectId}/issues`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Search issues in a project by title/description
 * GET /api/projects/{projectId}/issues/search
 * 
 * @param projectId - Project UUID
 * @param searchTerm - Search query
 * @param params - Additional filters and pagination
 * @returns Paginated issue list
 */
export const searchProjectIssues = async (
    projectId: string,
    searchTerm: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            `/projects/${projectId}/issues/search`,
            {
                params: {
                    searchTerm,
                    ...params,
                },
            }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get unassigned issues in a project
 * GET /api/projects/{projectId}/issues/unassigned
 * 
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @returns Paginated unassigned issue list
 */
export const getUnassignedIssues = async (
    projectId: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            `/projects/${projectId}/issues/unassigned`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get overdue issues in a project
 * GET /api/projects/{projectId}/issues/overdue
 * 
 * @param projectId - Project UUID
 * @param params - Date and pagination parameters
 * @returns Paginated overdue issue list
 */
export const getOverdueIssues = async (
    projectId: string,
    params?: OverdueIssuesParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            `/projects/${projectId}/issues/overdue`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get recently updated issues in a project
 * GET /api/projects/{projectId}/issues/recent
 * 
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @returns Paginated recently updated issue list
 */
export const getRecentlyUpdatedIssues = async (
    projectId: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            `/projects/${projectId}/issues/recently-updated`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Update an issue
 * PUT /api/projects/{projectId}/issues/{issueId}
 * 
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param data - Fields to update
 * @returns Updated issue
 */
export const updateIssue = async (
    projectId: string,
    issueId: string,
    data: UpdateIssueRequest
): Promise<IssueResponse> => {
    try {
        const response = await apiClient.put<IssueResponse>(
            `/projects/${projectId}/issues/${issueId}`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Update issue status with workflow validation
 * PUT /api/projects/{projectId}/issues/{issueId}/status
 * 
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param data - New status and optional reason
 * @returns Updated issue
 */
export const updateIssueStatus = async (
    projectId: string,
    issueId: string,
    data: UpdateIssueStatusRequest
): Promise<IssueResponse> => {
    try {
        const response = await apiClient.put<IssueResponse>(
            `/projects/${projectId}/issues/${issueId}/status`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Assign issue to a user
 * PUT /api/projects/{projectId}/issues/{issueId}/assign
 * 
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param data - Assignee information
 * @returns Updated issue
 */
export const assignIssue = async (
    projectId: string,
    issueId: string,
    data: AssignIssueRequest
): Promise<IssueResponse> => {
    try {
        const response = await apiClient.put<IssueResponse>(
            `/projects/${projectId}/issues/${issueId}/assign`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Delete an issue (soft delete)
 * DELETE /api/projects/{projectId}/issues/{issueId}
 * 
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 */
export const deleteIssue = async (
    projectId: string,
    issueId: string
): Promise<void> => {
    try {
        await apiClient.delete(`/projects/${projectId}/issues/${issueId}`);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

// ============================================================================
// Global Issue Operations
// ============================================================================

/**
 * Filter issues across all accessible projects
 * GET /api/issues/filter
 * 
 * @param filters - Filter criteria
 * @returns Paginated filtered issue list
 */
export const filterIssues = async (
    filters: IssueFilterParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            '/issues/filter',
            { params: filters }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get issues assigned to current user
 * GET /api/issues/my-assigned
 * 
 * @param params - Pagination parameters
 * @returns Paginated assigned issue list
 */
export const getMyAssignedIssues = async (
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            '/issues/my-assigned',
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get issues reported by current user
 * GET /api/issues/my-reported
 * 
 * @param params - Pagination parameters
 * @returns Paginated reported issue list
 */
export const getMyReportedIssues = async (
    params?: IssueSearchParams
): Promise<PageResponse<IssueSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueSummary>>(
            '/issues/my-reported',
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get issue by ID
 * GET /api/issues/{issueId}
 * 
 * @param issueId - Issue UUID
 * @returns Full issue details
 */
export const getIssueById = async (issueId: string): Promise<IssueResponse> => {
    try {
        const response = await apiClient.get<IssueResponse>(`/issues/${issueId}`);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get issue by key (e.g., PROJ-123)
 * GET /api/issues/key/{key}
 * 
 * @param key - Issue key (format: PROJECT_KEY-NUMBER)
 * @returns Full issue details
 */
export const getIssueByKey = async (key: string): Promise<IssueResponse> => {
    try {
        const response = await apiClient.get<IssueResponse>(`/issues/key/${key}`);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get issue change history
 * GET /api/issues/{issueId}/history
 * 
 * @param issueId - Issue UUID
 * @param params - Pagination parameters
 * @returns Paginated history list
 */
export const getIssueHistory = async (
    issueId: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueHistoryResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueHistoryResponse>>(
            `/issues/${issueId}/history`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getProjectIssuesHistory = async (
    projectId: string,
    params?: IssueSearchParams
): Promise<PageResponse<IssueHistoryResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<IssueHistoryResponse>>(
            `/projects/${projectId}/issues/activity`,
            { params }
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};