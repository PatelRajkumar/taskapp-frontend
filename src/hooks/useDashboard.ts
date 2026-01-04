/**
 * Dashboard Data Hooks
 * 
 * Custom hooks for fetching and aggregating dashboard data from existing APIs.
 * Uses existing project and issue hooks, combines data, and applies dashboard utilities.
 * 
 * No new backend APIs - all data comes from existing endpoints:
 * - GET /api/projects (user's projects)
 * - GET /api/projects/{id}/issues (issues per project)
 */

import { useMemo } from 'react';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { useUserProjects } from './useProjects';
import { issueKeys } from './useIssues';
import { getProjectIssues } from '@/interceptors/endpoints/issue.api';
import { useAuth } from './useAuth';
import type { ProjectResponse, PageResponse } from '@/interceptors/types/project.types';
import type { IssueResponse, IssueSummary } from '@/interceptors/types/issue.types';
import type {
    DateRangeFilter,
    DashboardData,
    DashboardMetrics,
    DashboardLoadingState,
    DashboardError,
} from '@/interceptors/types/dashboard.types';
import {
    getDateRange,
    isInDateRange,
    calculateDashboardMetrics,
    groupIssuesByStatus,
    groupIssuesByPriority,
    groupIssuesByType,
    prepareStatusChartData,
    calculateProjectCompletions,
    buildActivityTimeline,
    getUpcomingDueDates,
} from '@/utils/dashboard.utils';

/**
 * Main dashboard data hook
 * Fetches all user's projects and their issues, then aggregates metrics
 * 
 * @param dateRangeFilter - Date range filter for metrics
 * @returns Dashboard data with loading and error states
 * 
 * @example
 * const { data, isLoading, error } = useDashboardData({
 *   preset: DateRangePreset.LAST_30_DAYS
 * });
 * 
 * if (isLoading) return <LoadingState />;
 * if (error) return <ErrorState message={error.general} />;
 * 
 * return <MetricsGrid metrics={data.metrics} />;
 */
export const useDashboardData = (dateRangeFilter: DateRangeFilter) => {
    const { user } = useAuth();
    const currentUserId = user?.id || '';

    console.log('[useDashboardData] Initializing with filter:', dateRangeFilter);

    // Step 1: Fetch all user's projects (non-archived)
    const {
        data: projectsPage,
        isLoading: projectsLoading,
        error: projectsError,
    } = useUserProjects({
        page: 0,
        size: 100, // Fetch up to 100 projects (should be enough for most users)
        sort: 'createdAt,desc',
    });

    const projects = projectsPage?.content || [];
    console.log('[useDashboardData] Fetched projects:', projects.length);

    // Step 2: Fetch issues for each project in parallel
    // Uses useQueries for parallel fetching with individual loading states
    const issuesQueries = useQueries({
        queries: projects.map((project) => ({
            queryKey: issueKeys.list(project.id, { size: 100, searchTerm: "" }),
            queryFn: () =>
                getProjectIssues(project.id, {
                    searchTerm: "",
                    size: 100, // Fetch up to 100 issues per project
                    sort: 'createdAt,desc',
                }),
            staleTime: 3 * 60 * 1000, // 3 minutes
            enabled: !!project.id, // Only fetch if project ID exists
        })),
    });

    console.log('[useDashboardData] Issue queries count:', issuesQueries.length);

    // Step 3: Aggregate all issues from all projects
    const allIssuesAcrossProjects = useMemo(() => {
        const issues: IssueResponse[] = [];

        issuesQueries.forEach((query, index) => {
            if (query.data?.content) {
                const project = projects[index]; // Get the corresponding project

                // Convert IssueSummary to IssueResponse format by adding project field
                query.data.content.forEach((issueSummary) => {
                    // Enrich IssueSummary with project field for compatibility
                    const enrichedIssue = {
                        ...issueSummary,
                        project: {
                            id: project.id,
                            name: project.name,
                            key: project.key,
                        },
                    } as IssueResponse;

                    issues.push(enrichedIssue);
                });
            }
        });

        console.log('[useDashboardData] Total issues aggregated:', issues.length);
        return issues;
    }, [issuesQueries, projects]);

    // Step 4: Filter issues assigned to current user
    const myAssignedIssues = useMemo(() => {
        const assigned = allIssuesAcrossProjects.filter(
            (issue) => issue.assignee?.id === currentUserId
        );
        console.log('[useDashboardData] Issues assigned to user:', assigned.length);
        return assigned;
    }, [allIssuesAcrossProjects, currentUserId]);

    // Step 5: Apply date range filter
    const dateRange = useMemo(() => getDateRange(dateRangeFilter), [dateRangeFilter]);

    const filteredIssues = useMemo(() => {
        const filtered = myAssignedIssues.filter((issue) => isInDateRange(issue, dateRange));
        console.log('[useDashboardData] Issues after date filter:', filtered.length);
        return filtered;
    }, [myAssignedIssues, dateRange]);

    // Step 6: Calculate all dashboard metrics and data
    const dashboardData = useMemo<DashboardData | null>(() => {
        // Don't calculate if still loading or no data
        if (projectsLoading || issuesQueries.some((q) => q.isLoading)) {
            return null;
        }

        console.log('[useDashboardData] Calculating dashboard metrics...');

        // Calculate metrics
        const metrics = calculateDashboardMetrics(filteredIssues, projects);
        console.log('[useDashboardData] Metrics:', metrics);

        // Group issues
        const issuesByStatus = groupIssuesByStatus(filteredIssues);
        const issuesByPriority = groupIssuesByPriority(filteredIssues);
        const issuesByType = groupIssuesByType(filteredIssues);

        // Prepare chart data
        const statusChartData = prepareStatusChartData(issuesByStatus);
        const projectCompletions = calculateProjectCompletions(
            projects,
            allIssuesAcrossProjects,
            8 // Top 8 projects
        );

        // Build activity timeline
        // Note: Activity timeline requires full IssueResponse with reporter field
        // Since we only have IssueSummary here, timeline will be limited
        // We'll build it with available data
        const recentActivities = buildActivityTimeline(filteredIssues, currentUserId, 15);
        console.log('[useDashboardData] Recent activities:', recentActivities.length);

        // Get upcoming due dates
        const upcomingDues = getUpcomingDueDates(myAssignedIssues, 10);
        console.log('[useDashboardData] Upcoming dues:', upcomingDues.length);

        return {
            metrics,
            issuesByStatus,
            issuesByPriority,
            issuesByType,
            statusChartData,
            projectCompletions,
            recentActivities,
            upcomingDues,
            allAssignedIssues: myAssignedIssues,
        };
    }, [
        projectsLoading,
        issuesQueries,
        filteredIssues,
        projects,
        allIssuesAcrossProjects,
        currentUserId,
        myAssignedIssues,
    ]);

    // Step 7: Aggregate loading states
    const loadingState: DashboardLoadingState = useMemo(
        () => ({
            projects: projectsLoading,
            issues: issuesQueries.some((q) => q.isLoading),
            aggregating: !dashboardData && !projectsLoading && !issuesQueries.some((q) => q.isLoading),
        }),
        [projectsLoading, issuesQueries, dashboardData]
    );

    const isLoading =
        loadingState.projects || loadingState.issues || loadingState.aggregating;

    console.log('[useDashboardData] Loading states:', loadingState, 'Overall:', isLoading);

    // Step 8: Aggregate errors
    const errorState: DashboardError = useMemo(() => {
        const errors: DashboardError = {};

        if (projectsError) {
            errors.projects = projectsError.message || 'Failed to load projects';
        }

        const issueErrors = issuesQueries.filter((q) => q.error);
        if (issueErrors.length > 0) {
            errors.issues = `Failed to load issues for ${issueErrors.length} project(s)`;
        }

        if (Object.keys(errors).length > 0) {
            errors.general = 'Some dashboard data could not be loaded';
        }

        return errors;
    }, [projectsError, issuesQueries]);

    const hasError = Object.keys(errorState).length > 0;

    if (hasError) {
        console.error('[useDashboardData] Errors:', errorState);
    }

    return {
        data: dashboardData,
        isLoading,
        loadingState,
        error: hasError ? errorState : null,
        projects, // Expose projects for navigation/filtering
        refetch: () => {
            console.log('[useDashboardData] Manual refetch triggered');
            // Refetch will happen automatically via React Query
        },
    };
};

/**
 * Get dashboard data type helper
 * Useful for conditional rendering and type narrowing
 */
export type UseDashboardDataReturn = ReturnType<typeof useDashboardData>;