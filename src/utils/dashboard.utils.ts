/**
 * Dashboard Utility Functions
 * 
 * Helper functions for dashboard data processing, calculations, and formatting.
 * All functions work with existing API response types (IssueResponse, ProjectResponse).
 */

import {
    startOfDay,
    endOfDay,
    subDays,
    differenceInDays,
    formatDistanceToNow,
    isAfter,
    isBefore,
    parseISO,
    format,
} from 'date-fns';

import type { IssueResponse, IssueSummary } from '@/interceptors/types/issue.types';
import type { ProjectResponse } from '@/interceptors/types/project.types';
import {
    DateRangePreset,
    DateRangeFilter,
    DateRange,
    DashboardMetrics,
    IssuesByStatus,
    IssuesByPriority,
    IssuesByType,
    StatusChartData,
    ProjectCompletion,
    Activity,
    ActivityType,
    UpcomingIssue,
} from '@/interceptors/types/dashboard.types';
import {
    ISSUE_STATUS,
    ISSUE_STATUS_LABELS,
    ISSUE_STATUS_COLORS,
    ISSUE_PRIORITY,
    ISSUE_TYPE,
    type IssueStatus,
    type IssuePriority,
    type IssueType,
} from '@/utils/constants';

// ============================================================================
// Date Range Utilities
// ============================================================================

/**
 * Get date range boundaries based on preset or custom dates
 * 
 * @param filter - Date range filter with preset or custom dates
 * @returns Start and end dates for filtering
 */
export function getDateRange(filter: DateRangeFilter): DateRange {
    const now = new Date();
    const today = endOfDay(now);

    switch (filter.preset) {
        case DateRangePreset.LAST_7_DAYS:
            return {
                start: startOfDay(subDays(now, 7)),
                end: today,
            };

        case DateRangePreset.LAST_30_DAYS:
            return {
                start: startOfDay(subDays(now, 30)),
                end: today,
            };

        case DateRangePreset.LAST_90_DAYS:
            return {
                start: startOfDay(subDays(now, 90)),
                end: today,
            };

        case DateRangePreset.ALL_TIME:
            return {
                start: new Date(0), // Unix epoch
                end: today,
            };

        case DateRangePreset.CUSTOM:
            if (!filter.customStart || !filter.customEnd) {
                // Fallback to last 30 days if custom dates not provided
                return {
                    start: startOfDay(subDays(now, 30)),
                    end: today,
                };
            }
            return {
                start: startOfDay(filter.customStart),
                end: endOfDay(filter.customEnd),
            };

        default:
            // Default to last 30 days
            return {
                start: startOfDay(subDays(now, 30)),
                end: today,
            };
    }
}

/**
 * Check if an issue was created within the date range
 * 
 * @param issue - Issue to check
 * @param dateRange - Date range boundaries
 * @returns true if issue.createdAt is within range
 */
export function isInDateRange(
    issue: IssueResponse | IssueSummary,
    dateRange: DateRange
): boolean {
    const createdAt = parseISO(issue.createdAt);
    return isAfter(createdAt, dateRange.start) && isBefore(createdAt, dateRange.end);
}

/**
 * Check if an issue's due date is within the date range
 * 
 * @param issue - Issue to check
 * @param dateRange - Date range boundaries
 * @returns true if issue.dueDate is within range
 */
export function isDueDateInRange(
    issue: IssueResponse | IssueSummary,
    dateRange: DateRange
): boolean {
    if (!issue.dueDate) return false;

    const dueDate = parseISO(issue.dueDate);
    return isAfter(dueDate, dateRange.start) && isBefore(dueDate, dateRange.end);
}

// ============================================================================
// Issue Status Checks
// ============================================================================

/**
 * Check if an issue is overdue
 * Issue is overdue if: dueDate < today AND status !== DONE
 * 
 * @param issue - Issue to check
 * @returns true if issue is overdue
 */
export function isOverdue(issue: IssueResponse | IssueSummary): boolean {
    if (!issue.dueDate || issue.status === ISSUE_STATUS.DONE) {
        return false;
    }

    const dueDate = parseISO(issue.dueDate);
    const today = startOfDay(new Date());

    return isBefore(dueDate, today);
}

/**
 * Check if an issue is due today
 * 
 * @param issue - Issue to check
 * @returns true if issue is due today
 */
export function isDueToday(issue: IssueResponse | IssueSummary): boolean {
    if (!issue.dueDate) return false;

    const dueDate = parseISO(issue.dueDate);
    const today = startOfDay(new Date());

    return format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
}

/**
 * Get days until issue is due (negative if overdue)
 * 
 * @param issue - Issue to check
 * @returns Number of days until due (negative if overdue, null if no due date)
 */
export function getDaysUntilDue(issue: IssueResponse | IssueSummary): number | null {
    if (!issue.dueDate) return null;

    const dueDate = parseISO(issue.dueDate);
    const today = startOfDay(new Date());

    return differenceInDays(dueDate, today);
}

// ============================================================================
// Metric Calculations
// ============================================================================

/**
 * Calculate dashboard overview metrics
 * 
 * @param allIssues - All issues assigned to user (filtered by date range if needed)
 * @param projects - All accessible projects
 * @returns Dashboard metrics
 */
export function calculateDashboardMetrics(
    allIssues: IssueResponse[],
    projects: ProjectResponse[]
): DashboardMetrics {
    const totalAssignedIssues = allIssues.length;

    const overdueIssues = allIssues.filter(isOverdue).length;

    const completedIssues = allIssues.filter(
        (issue) => issue.status === ISSUE_STATUS.DONE
    ).length;

    const completionRate = totalAssignedIssues > 0
        ? Math.round((completedIssues / totalAssignedIssues) * 100)
        : 0;

    const activeProjects = projects.filter((p) => !p.isArchived).length;

    return {
        totalAssignedIssues,
        overdueIssues,
        completionRate,
        activeProjects,
    };
}

/**
 * Calculate completion rate percentage
 * 
 * @param issues - Issues to calculate from
 * @returns Completion percentage (0-100)
 */
export function calculateCompletionRate(issues: IssueResponse[]): number {
    if (issues.length === 0) return 0;

    const completedCount = issues.filter(
        (issue) => issue.status === ISSUE_STATUS.DONE
    ).length;

    return Math.round((completedCount / issues.length) * 100);
}

// ============================================================================
// Issue Grouping
// ============================================================================

/**
 * Group issues by status
 * 
 * @param issues - Issues to group
 * @returns Issue counts by status
 */
export function groupIssuesByStatus(issues: IssueResponse[]): IssuesByStatus {
    return {
        TODO: issues.filter((i) => i.status === ISSUE_STATUS.TODO).length,
        INPROGRESS: issues.filter((i) => i.status === ISSUE_STATUS.INPROGRESS).length,
        DONE: issues.filter((i) => i.status === ISSUE_STATUS.DONE).length,
    };
}

/**
 * Group issues by priority
 * 
 * @param issues - Issues to group
 * @returns Issue counts by priority
 */
export function groupIssuesByPriority(issues: IssueResponse[]): IssuesByPriority {
    return {
        LOW: issues.filter((i) => i.priority === ISSUE_PRIORITY.LOW).length,
        MEDIUM: issues.filter((i) => i.priority === ISSUE_PRIORITY.MEDIUM).length,
        HIGH: issues.filter((i) => i.priority === ISSUE_PRIORITY.HIGH).length,
    };
}

/**
 * Group issues by type
 * 
 * @param issues - Issues to group
 * @returns Issue counts by type
 */
export function groupIssuesByType(issues: IssueResponse[]): IssuesByType {
    return {
        TASK: issues.filter((i) => i.type === ISSUE_TYPE.TASK).length,
        BUG: issues.filter((i) => i.type === ISSUE_TYPE.BUG).length,
    };
}

// ============================================================================
// Chart Data Preparation
// ============================================================================

/**
 * Convert status counts to chart data format
 * 
 * @param statusCounts - Issue counts by status
 * @returns Array of chart data objects for Recharts
 */
export function prepareStatusChartData(statusCounts: IssuesByStatus): StatusChartData[] {
    return [
        {
            name: ISSUE_STATUS_LABELS.TODO,
            value: statusCounts.TODO,
            color: ISSUE_STATUS_COLORS.TODO,
            status: ISSUE_STATUS.TODO,
        },
        {
            name: ISSUE_STATUS_LABELS.INPROGRESS,
            value: statusCounts.INPROGRESS,
            color: ISSUE_STATUS_COLORS.INPROGRESS,
            status: ISSUE_STATUS.INPROGRESS,
        },
        {
            name: ISSUE_STATUS_LABELS.DONE,
            value: statusCounts.DONE,
            color: ISSUE_STATUS_COLORS.DONE,
            status: ISSUE_STATUS.DONE,
        },
    ].filter((item) => item.value > 0); // Only include statuses with issues
}

/**
 * Calculate project completion data for bar chart
 * Shows top projects by total issue count
 * 
 * @param projects - All accessible projects
 * @param allIssues - All issues across all projects
 * @param topN - Number of top projects to return (default: 8)
 * @returns Array of project completion data, sorted by total issues descending
 */
export function calculateProjectCompletions(
    projects: ProjectResponse[],
    allIssues: IssueResponse[],
    topN: number = 8
): ProjectCompletion[] {
    const completions: ProjectCompletion[] = projects
        .filter((p) => !p.isArchived)
        .map((project) => {
            const projectIssues = allIssues.filter(
                (issue) => issue.project.id === project.id
            );

            const totalIssues = projectIssues.length;
            const completedIssues = projectIssues.filter(
                (i) => i.status === ISSUE_STATUS.DONE
            ).length;
            const inProgressIssues = projectIssues.filter(
                (i) => i.status === ISSUE_STATUS.INPROGRESS
            ).length;
            const todoIssues = projectIssues.filter(
                (i) => i.status === ISSUE_STATUS.TODO
            ).length;

            const completionPercentage = totalIssues > 0
                ? Math.round((completedIssues / totalIssues) * 100)
                : 0;

            return {
                projectId: project.id,
                projectName: project.name,
                projectKey: project.key,
                totalIssues,
                completedIssues,
                completionPercentage,
                inProgressIssues,
                todoIssues,
            };
        })
        .filter((p) => p.totalIssues > 0) // Only include projects with issues
        .sort((a, b) => b.totalIssues - a.totalIssues) // Sort by total issues descending
        .slice(0, topN); // Take top N projects

    return completions;
}

// ============================================================================
// Activity Timeline
// ============================================================================

/**
 * Build activity timeline from issues
 * Creates activities for: created, assigned, completed, status changes
 * 
 * @param issues - All issues assigned to user
 * @param currentUserId - Current user's ID
 * @param limit - Maximum number of activities to return (default: 15)
 * @returns Array of activities, sorted by timestamp descending
 */
export function buildActivityTimeline(
    issues: IssueResponse[],
    currentUserId: string,
    limit: number = 15
): Activity[] {
    const activities: Activity[] = [];

    issues.forEach((issue) => {
        // Activity: Issue Created (if user is reporter)
        if (issue.reporter.id === currentUserId) {
            activities.push({
                id: `${issue.id}-created`,
                type: ActivityType.ISSUE_CREATED,
                issueKey: issue.key,
                issueTitle: issue.title,
                issueId: issue.id,
                projectId: issue.project.id,
                timestamp: issue.createdAt,
                description: `You created ${issue.key}: ${issue.title}`,
            });
        }

        // Activity: Issue Assigned (if user is assignee and not reporter)
        if (issue.assignee?.id === currentUserId && issue.reporter.id !== currentUserId) {
            activities.push({
                id: `${issue.id}-assigned`,
                type: ActivityType.ISSUE_ASSIGNED,
                issueKey: issue.key,
                issueTitle: issue.title,
                issueId: issue.id,
                projectId: issue.project.id,
                timestamp: issue.updatedAt, // Approximation (actual assignment time not tracked)
                description: `You were assigned ${issue.key}: ${issue.title}`,
            });
        }

        // Activity: Issue Completed (if user is assignee and status is DONE)
        if (issue.assignee?.id === currentUserId && issue.status === ISSUE_STATUS.DONE && issue.closedAt) {
            activities.push({
                id: `${issue.id}-completed`,
                type: ActivityType.ISSUE_COMPLETED,
                issueKey: issue.key,
                issueTitle: issue.title,
                issueId: issue.id,
                projectId: issue.project.id,
                timestamp: issue.closedAt,
                description: `You completed ${issue.key}: ${issue.title}`,
            });
        }

        // Activity: Status Changed to IN PROGRESS (if user is assignee)
        if (
            issue.assignee?.id === currentUserId &&
            issue.status === ISSUE_STATUS.INPROGRESS &&
            issue.resolvedAt // Use resolvedAt as proxy for status change time
        ) {
            activities.push({
                id: `${issue.id}-inprogress`,
                type: ActivityType.STATUS_CHANGED,
                issueKey: issue.key,
                issueTitle: issue.title,
                issueId: issue.id,
                projectId: issue.project.id,
                timestamp: issue.resolvedAt,
                description: `You moved ${issue.key} to In Progress`,
                oldStatus: ISSUE_STATUS.TODO,
                newStatus: ISSUE_STATUS.INPROGRESS,
            });
        }
    });

    // Sort by timestamp descending (most recent first)
    activities.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return activities.slice(0, limit);
}

// ============================================================================
// Upcoming Due Dates
// ============================================================================

/**
 * Get upcoming due dates for assigned issues
 * Includes overdue issues and issues due in the future (excluding DONE)
 * 
 * @param issues - All issues assigned to user
 * @param limit - Maximum number of issues to return (default: 10)
 * @returns Array of upcoming issues, sorted by due date ascending
 */
export function getUpcomingDueDates(
    issues: IssueResponse[],
    limit: number = 10
): UpcomingIssue[] {
    const today = startOfDay(new Date());

    const upcomingIssues = issues
        .filter((issue) => {
            // Must have due date and not be DONE
            return issue.dueDate && issue.status !== ISSUE_STATUS.DONE;
        })
        .map((issue) => {
            const dueDate = parseISO(issue.dueDate!);
            const daysUntilDue = differenceInDays(dueDate, today);
            const overdue = isBefore(dueDate, today);

            return {
                id: issue.id,
                key: issue.key,
                title: issue.title,
                dueDate: issue.dueDate!,
                priority: issue.priority,
                status: issue.status,
                projectName: issue.project.name,
                projectId: issue.project.id,
                isOverdue: overdue,
                daysUntilDue,
            };
        })
        .sort((a, b) => {
            // Sort by due date ascending (earliest first)
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .slice(0, limit);

    return upcomingIssues;
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format relative time from now
 * Examples: "2 hours ago", "3 days ago", "in 2 days"
 * 
 * @param date - Date to format (ISO string or Date object)
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
}

/**
 * Format days until due as human-readable string
 * 
 * @param daysUntilDue - Number of days (negative if overdue)
 * @returns Formatted string ("Overdue by 3 days", "Due in 2 days", "Due today")
 */
export function formatDaysUntilDue(daysUntilDue: number): string {
    if (daysUntilDue === 0) {
        return 'Due today';
    } else if (daysUntilDue < 0) {
        const daysOverdue = Math.abs(daysUntilDue);
        return `Overdue by ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'}`;
    } else {
        return `Due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}`;
    }
}

/**
 * Get color for due date chip based on days until due
 * 
 * @param daysUntilDue - Number of days (negative if overdue)
 * @returns MUI chip color
 */
export function getDueDateChipColor(
    daysUntilDue: number
): 'error' | 'warning' | 'success' | 'default' {
    if (daysUntilDue < 0) {
        return 'error'; // Overdue - red
    } else if (daysUntilDue === 0) {
        return 'warning'; // Due today - orange
    } else if (daysUntilDue <= 2) {
        return 'warning'; // Due soon (<= 2 days) - orange
    } else {
        return 'success'; // Due later - green
    }
}

/**
 * Get color for project completion percentage
 * 
 * @param completionPercentage - Completion percentage (0-100)
 * @returns Color hex code
 */
export function getCompletionColor(completionPercentage: number): string {
    if (completionPercentage >= 75) {
        return '#4caf50'; // Green
    } else if (completionPercentage >= 50) {
        return '#ff9800'; // Orange
    } else if (completionPercentage >= 25) {
        return '#ffc107'; // Yellow
    } else {
        return '#f44336'; // Red
    }
}