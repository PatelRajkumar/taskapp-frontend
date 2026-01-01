/**
 * Dashboard Types
 * 
 * Type definitions for dashboard metrics, charts, and activity data.
 * These types aggregate data from existing backend DTOs (IssueResponse, ProjectResponse, etc.)
 * No new backend APIs are created - all data is derived from existing endpoints.
 */

import type { IssueResponse, IssueSummary } from '@/interceptors/types/issue.types';
import type { ProjectResponse } from '@/interceptors/types/project.types';
import type { IssueStatus, IssuePriority, IssueType } from '@/utils/constants';

// ============================================================================
// Date Range Types
// ============================================================================

/**
 * Predefined date range options for dashboard filtering
 */
export enum DateRangePreset {
    LAST_7_DAYS = 'LAST_7_DAYS',
    LAST_30_DAYS = 'LAST_30_DAYS',
    LAST_90_DAYS = 'LAST_90_DAYS',
    ALL_TIME = 'ALL_TIME',
    CUSTOM = 'CUSTOM',
}

/**
 * Date range preset labels for UI display
 */
export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
    [DateRangePreset.LAST_7_DAYS]: 'Last 7 days',
    [DateRangePreset.LAST_30_DAYS]: 'Last 30 days',
    [DateRangePreset.LAST_90_DAYS]: 'Last 90 days',
    [DateRangePreset.ALL_TIME]: 'All time',
    [DateRangePreset.CUSTOM]: 'Custom range',
};

/**
 * Date range filter state
 */
export interface DateRangeFilter {
    preset: DateRangePreset;
    customStart?: Date; // Only for CUSTOM preset
    customEnd?: Date;   // Only for CUSTOM preset
}

/**
 * Computed date range boundaries
 */
export interface DateRange {
    start: Date;
    end: Date;
}

// ============================================================================
// Metric Types
// ============================================================================

/**
 * Dashboard overview metrics
 * Aggregated from user's accessible projects and assigned issues
 */
export interface DashboardMetrics {
    /** Total issues assigned to current user */
    totalAssignedIssues: number;

    /** Issues that are overdue (dueDate < today && status !== DONE) */
    overdueIssues: number;

    /** Completion rate percentage for assigned issues (DONE / total) */
    completionRate: number;

    /** Number of active (non-archived) projects user has access to */
    activeProjects: number;
}

/**
 * Issue count grouped by status
 */
export interface IssuesByStatus {
    [key: string]: number; // Using string index for IssueStatus values
    TODO: number;
    INPROGRESS: number;
    DONE: number;
}

/**
 * Issue count grouped by priority
 */
export interface IssuesByPriority {
    [key: string]: number; // Using string index for IssuePriority values
    LOW: number;
    MEDIUM: number;
    HIGH: number;
}

/**
 * Issue count grouped by type
 */
export interface IssuesByType {
    [key: string]: number; // Using string index for IssueType values
    TASK: number;
    BUG: number;
}

// ============================================================================
// Chart Data Types
// ============================================================================

/**
 * Data structure for pie/donut chart (Issues by Status)
 */
export interface StatusChartData {
    name: string;     // Status label (e.g., "To Do", "In Progress", "Done")
    value: number;    // Issue count
    color: string;    // Chart color
    status: IssueStatus; // Original enum value for filtering
}

/**
 * Project completion data for bar chart
 */
export interface ProjectCompletion {
    projectId: string;
    projectName: string;
    projectKey: string;
    totalIssues: number;
    completedIssues: number;
    completionPercentage: number; // 0-100
    inProgressIssues: number;
    todoIssues: number;
}

// ============================================================================
// Activity Timeline Types
// ============================================================================

/**
 * Activity types for timeline
 */
export enum ActivityType {
    ISSUE_CREATED = 'ISSUE_CREATED',
    ISSUE_ASSIGNED = 'ISSUE_ASSIGNED',
    ISSUE_COMPLETED = 'ISSUE_COMPLETED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    COMMENT_ADDED = 'COMMENT_ADDED',
}

/**
 * Activity type labels for UI display
 */
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    [ActivityType.ISSUE_CREATED]: 'Created',
    [ActivityType.ISSUE_ASSIGNED]: 'Assigned',
    [ActivityType.ISSUE_COMPLETED]: 'Completed',
    [ActivityType.STATUS_CHANGED]: 'Status Changed',
    [ActivityType.COMMENT_ADDED]: 'Commented',
};

/**
 * Single activity item for timeline
 * Derived from issue creation/update timestamps
 */
export interface Activity {
    id: string;           // Unique ID (issue.id or comment.id)
    type: ActivityType;
    issueKey: string;     // e.g., "PROJ-123"
    issueTitle: string;
    issueId: string;      // For navigation
    projectId: string;    // For navigation
    timestamp: string;    // ISO string
    description: string;  // Human-readable description
    oldStatus?: IssueStatus; // For STATUS_CHANGED
    newStatus?: IssueStatus; // For STATUS_CHANGED
}

// ============================================================================
// Due Date Types
// ============================================================================

/**
 * Issue with due date information for upcoming dues list
 */
export interface UpcomingIssue {
    id: string;
    key: string;
    title: string;
    dueDate: string;      // ISO date string (YYYY-MM-DD)
    priority: IssuePriority;
    status: IssueStatus;
    projectName: string;
    projectId: string;
    isOverdue: boolean;
    daysUntilDue: number; // Negative if overdue
}

// ============================================================================
// Aggregated Dashboard Data
// ============================================================================

/**
 * Complete dashboard data structure
 * All data is computed from existing API responses (projects, issues)
 */
export interface DashboardData {
    /** Overview metrics */
    metrics: DashboardMetrics;

    /** Issues grouped by status */
    issuesByStatus: IssuesByStatus;

    /** Issues grouped by priority */
    issuesByPriority: IssuesByPriority;

    /** Issues grouped by type */
    issuesByType: IssuesByType;

    /** Chart data for status distribution */
    statusChartData: StatusChartData[];

    /** Project completion data for bar chart */
    projectCompletions: ProjectCompletion[];

    /** Recent activity timeline (last 15 items) */
    recentActivities: Activity[];

    /** Upcoming due dates (next 10 items) */
    upcomingDues: UpcomingIssue[];

    /** All issues assigned to user (for filtering) */
    allAssignedIssues: IssueResponse[];
}

// ============================================================================
// Loading States
// ============================================================================

/**
 * Dashboard loading states
 */
export interface DashboardLoadingState {
    projects: boolean;
    issues: boolean;
    aggregating: boolean;
}

// ============================================================================
// Error States
// ============================================================================

/**
 * Dashboard error states
 */
export interface DashboardError {
    projects?: string;
    issues?: string;
    general?: string;
}