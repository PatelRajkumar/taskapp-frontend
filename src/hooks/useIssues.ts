/**
 * Issue Query Hooks
 * Handles all read operations (GET requests) for issues
 * Uses TanStack Query for caching, background refetching, and loading states
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
    getProjectIssues,
    searchProjectIssues,
    getUnassignedIssues,
    getOverdueIssues,
    getRecentlyUpdatedIssues,
    filterIssues,
    getMyAssignedIssues,
    getMyReportedIssues,
    getIssueById,
    getIssueByKey,
    getIssueHistory,
    getProjectIssuesHistory,
} from '@/interceptors/endpoints/issue.api';
import type {
    IssueResponse,
    IssueSummary,
    IssueHistoryResponse,
    IssueFilterParams,
    IssueSearchParams,
    OverdueIssuesParams,
} from '@/interceptors/types/issue.types';
import type { PageResponse } from '@/interceptors/types/project.types';

/**
 * Query Keys for Issues
 * Hierarchical structure allows targeted cache invalidation
 */
export const issueKeys = {
    all: ['issues'] as const,
    lists: () => [...issueKeys.all, 'list'] as const,
    list: (projectId: string, filters?: IssueSearchParams) =>
        [...issueKeys.all, 'project', projectId, 'list', filters] as const,
    search: (projectId: string, searchTerm: string, filters?: IssueSearchParams) =>
        [...issueKeys.all, 'project', projectId, 'search', searchTerm, filters] as const,
    unassigned: (projectId: string, filters?: IssueSearchParams) =>
        [...issueKeys.all, 'project', projectId, 'unassigned', filters] as const,
    overdue: (projectId: string, filters?: OverdueIssuesParams) =>
        [...issueKeys.all, 'project', projectId, 'overdue', filters] as const,
    recent: (projectId: string, filters?: IssueSearchParams) =>
        [...issueKeys.all, 'project', projectId, 'recent', filters] as const,
    filtered: (filters: IssueFilterParams) =>
        [...issueKeys.all, 'filter', filters] as const,
    myAssigned: (filters?: IssueSearchParams) =>
        [...issueKeys.all, 'my-assigned', filters] as const,
    myReported: (filters?: IssueSearchParams) =>
        [...issueKeys.all, 'my-reported', filters] as const,
    details: () => [...issueKeys.all, 'detail'] as const,
    detail: (issueId: string) => [...issueKeys.details(), issueId] as const,
    detailByKey: (key: string) => [...issueKeys.details(), 'key', key] as const,
    history: (issueId: string, filters?: IssueSearchParams) =>
        [...issueKeys.detail(issueId), 'history', filters] as const,
    projectHistory: (projectId: string, filters?: IssueSearchParams) =>
        [...issueKeys.all, 'project', projectId, 'history', filters] as const,
};

// ============================================================================
// Project-Scoped Issue Queries
// ============================================================================

/**
 * Get all issues in a project (paginated)
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param params - Pagination and filter parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with paginated issue list
 *
 * @example
 * const { data, isLoading, error } = useProjectIssues(projectId, { page: 0, size: 20 });
 * console.log(data?.content); // Array of issues
 * console.log(data?.totalPages); // Total pages available
 */
export const useProjectIssues = (
    projectId: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.list(projectId, params),
        queryFn: () => getProjectIssues(projectId, params),
        enabled: enabled && !!projectId,
        staleTime: 3 * 60 * 1000, // 3 minutes
    });
};

/**
 * Search issues in a project by title/description
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param searchTerm - Search query
 * @param params - Additional filters and pagination
 * @param enabled - Whether to execute query (default: true if searchTerm provided)
 * @returns Query result with search results
 *
 * @example
 * const { data, isLoading } = useSearchProjectIssues(projectId, 'bug', { page: 0, size: 10 });
 */
export const useSearchProjectIssues = (
    projectId: string,
    searchTerm: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.search(projectId, searchTerm, params),
        queryFn: () => searchProjectIssues(projectId, searchTerm, params),
        enabled: enabled && !!projectId && searchTerm.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
    });
};

/**
 * Get unassigned issues in a project
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with unassigned issue list
 *
 * @example
 * const { data, isLoading } = useUnassignedIssues(projectId, { page: 0, size: 20 });
 */
export const useUnassignedIssues = (
    projectId: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.unassigned(projectId, params),
        queryFn: () => getUnassignedIssues(projectId, params),
        enabled: enabled && !!projectId,
        staleTime: 3 * 60 * 1000,
    });
};

/**
 * Get overdue issues in a project
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param params - Date and pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with overdue issue list
 *
 * @example
 * const { data, isLoading } = useOverdueIssues(projectId, { asOfDate: '2024-12-26' });
 */
export const useOverdueIssues = (
    projectId: string,
    params?: OverdueIssuesParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.overdue(projectId, params),
        queryFn: () => getOverdueIssues(projectId, params),
        enabled: enabled && !!projectId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Get recently updated issues in a project
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with recently updated issue list
 *
 * @example
 * const { data, isLoading } = useRecentlyUpdatedIssues(projectId, { page: 0, size: 10 });
 */
export const useRecentlyUpdatedIssues = (
    projectId: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.recent(projectId, params),
        queryFn: () => getRecentlyUpdatedIssues(projectId, params),
        enabled: enabled && !!projectId,
        staleTime: 2 * 60 * 1000, // 2 minutes (recent updates change frequently)
    });
};

// ============================================================================
// Global Issue Queries
// ============================================================================

/**
 * Filter issues across all accessible projects
 * Returns issues from all projects where user is a member
 *
 * @param filters - Filter criteria (projectId, status, type, priority, etc.)
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with filtered issue list
 *
 * @example
 * const { data, isLoading } = useFilteredIssues({ 
 *   status: 'TODO', 
 *   priority: 'HIGH',
 *   page: 0,
 *   size: 20 
 * });
 */
export const useFilteredIssues = (
    filters: IssueFilterParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.filtered(filters),
        queryFn: () => filterIssues(filters),
        enabled,
        staleTime: 3 * 60 * 1000,
    });
};

/**
 * Get issues assigned to current user
 * Returns issues from all projects where user is assigned
 *
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with assigned issue list
 *
 * @example
 * const { data, isLoading } = useMyAssignedIssues({ page: 0, size: 20 });
 */
export const useMyAssignedIssues = (
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.myAssigned(params),
        queryFn: () => getMyAssignedIssues(params),
        enabled,
        staleTime: 3 * 60 * 1000,
    });
};

/**
 * Get issues reported by current user
 * Returns issues from all projects where user is reporter
 *
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with reported issue list
 *
 * @example
 * const { data, isLoading } = useMyReportedIssues({ page: 0, size: 20 });
 */
export const useMyReportedIssues = (
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueSummary>, Error> => {
    return useQuery({
        queryKey: issueKeys.myReported(params),
        queryFn: () => getMyReportedIssues(params),
        enabled,
        staleTime: 3 * 60 * 1000,
    });
};

// ============================================================================
// Single Issue Queries
// ============================================================================

/**
 * Get single issue by ID
 * Requires project membership
 *
 * @param issueId - Issue UUID
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with issue details
 *
 * @example
 * const { data: issue, isLoading, error } = useIssue(issueId);
 */
export const useIssue = (
    issueId: string,
    enabled: boolean = true
): UseQueryResult<IssueResponse, Error> => {
    return useQuery({
        queryKey: issueKeys.detail(issueId),
        queryFn: () => getIssueById(issueId),
        enabled: enabled && !!issueId,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Get single issue by key (e.g., PROJ-123)
 * Requires project membership
 * Use this for routing/URL params since keys are human-readable
 *
 * @param key - Issue key (format: PROJECT_KEY-NUMBER)
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with issue details
 *
 * @example
 * const { data: issue, isLoading } = useIssueByKey('PROJ-123');
 */
export const useIssueByKey = (
    key: string,
    enabled: boolean = true
): UseQueryResult<IssueResponse, Error> => {
    return useQuery({
        queryKey: issueKeys.detailByKey(key),
        queryFn: () => getIssueByKey(key),
        enabled: enabled && !!key,
        staleTime: 5 * 60 * 1000,
    });
};

// ============================================================================
// History Queries
// ============================================================================

/**
 * Get issue change history
 * Requires project membership
 * Shows all field changes for a specific issue
 *
 * @param issueId - Issue UUID
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with paginated history list
 *
 * @example
 * const { data: history, isLoading } = useIssueHistory(issueId, { page: 0, size: 20 });
 * history?.content.forEach(h => console.log(h.field, h.oldValue, h.newValue));
 */
export const useIssueHistory = (
    issueId: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueHistoryResponse>, Error> => {
    return useQuery({
        queryKey: issueKeys.history(issueId, params),
        queryFn: () => getIssueHistory(issueId, params),
        enabled: enabled && !!issueId,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Get project activity history (all issue changes in project)
 * Requires project membership
 * Shows chronological changes across all issues in the project
 *
 * @param projectId - Project UUID
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with paginated project history
 *
 * @example
 * const { data: activity, isLoading } = useProjectActivityHistory(projectId, { page: 0, size: 50 });
 */
export const useProjectActivityHistory = (
    projectId: string,
    params?: IssueSearchParams,
    enabled: boolean = true
): UseQueryResult<PageResponse<IssueHistoryResponse>, Error> => {
    return useQuery({
        queryKey: issueKeys.projectHistory(projectId, params),
        queryFn: () => getProjectIssuesHistory(projectId, params),
        enabled: enabled && !!projectId,
        staleTime: 2 * 60 * 1000, // 2 minutes (activity changes frequently)
    });
};