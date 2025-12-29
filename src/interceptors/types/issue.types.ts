/**
 * Issue API Types
 * These types match the backend DTOs exactly
 */

import type { IssueStatus, IssuePriority, IssueType } from '@/utils/constants';
import type { ProjectSummary, UserSummary, PageableRequest } from './project.types';

// ============================================================================
// Response DTOs (Match Backend Exactly)
// ============================================================================

/**
 * Issue response DTO (matches backend IssueResponseDTO)
 * Complete issue information with all details
 */
export interface IssueResponse {
  id: string;
  key: string; // Format: PROJ-123
  title: string;
  description?: string;
  project: ProjectSummary;
  sequentialNumber: number;
  type: IssueType;
  dueDate?: string; // LocalDate as ISO string (YYYY-MM-DD)
  priority: IssuePriority;
  status: IssueStatus;
  reporter: UserSummary;
  assignee?: UserSummary;
  createdAt: string; // Instant as ISO string
  updatedAt: string; // Instant as ISO string
  resolvedAt?: string; // Instant as ISO string
  closedAt?: string; // Instant as ISO string
}

/**
 * Issue summary DTO (matches backend IssueSummaryDTO)
 * Lightweight version for lists and search results
 */
export interface IssueSummary {
  id: string;
  key: string;
  title: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  assignee?: UserSummary;
  dueDate?: string; // LocalDate as ISO string (YYYY-MM-DD)
  createdAt: string; // Instant as ISO string
  updatedAt: string; // Instant as ISO string
}

/**
 * Issue history response DTO (matches backend IssueHistoryResponseDTO)
 * Tracks changes made to an issue
 */
export interface IssueHistoryResponse {
  id: string;
  field: string; // "status", "assignee", "priority", "title", etc.
  oldValue?: string;
  newValue?: string;
  changedBy: UserSummary;
  changedAt: string; // Instant as ISO string
}

// ============================================================================
// Request DTOs (Match Backend Exactly)
// ============================================================================

/**
 * Create issue request DTO (matches backend IssueCreateRequestDTO)
 * 
 * Validation rules (enforced by backend):
 * - title: required, 3-500 characters
 * - description: optional, max 5000 characters
 * - type: defaults to TASK if not specified
 * - priority: defaults to MEDIUM if not specified
 * - dueDate: optional, validated in service layer
 * - assigneeId: optional, must be project member
 */
export interface CreateIssueRequest {
  title: string;
  description?: string;
  type?: IssueType; // Default: TASK
  dueDate?: string; // LocalDate as ISO string (YYYY-MM-DD)
  priority?: IssuePriority; // Default: MEDIUM
  assigneeId?: string; // UUID
}

/**
 * Update issue request DTO (matches backend IssueUpdateRequestDTO)
 * All fields are optional - only provided fields will be updated
 * 
 * Validation rules:
 * - title: if provided, 3-500 characters
 * - description: if provided, max 5000 characters
 * - At least one field must be provided
 * 
 * Note: Status updates use separate endpoint
 */
export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  dueDate?: string; // LocalDate as ISO string (YYYY-MM-DD)
  priority?: IssuePriority;
  assigneeId?: string; // UUID (null to unassign)
}

/**
 * Update issue status request DTO (matches backend IssueUpdateStatusRequestDTO)
 * 
 * Validation rules:
 * - newStatus: required, must follow workflow (TODO → INPROGRESS → DONE)
 * - reason: optional, max 500 characters
 */
export interface UpdateIssueStatusRequest {
  newStatus: IssueStatus;
  reason?: string; // Optional reason for audit trail
}

/**
 * Assign issue request DTO (matches backend IssueAssignRequestDTO)
 * 
 * Validation rules:
 * - assigneeId: optional (null/undefined to unassign)
 * - assignee must be project member (validated in service layer)
 */
export interface AssignIssueRequest {
  assigneeId?: string; // UUID (null to unassign)
}

// ============================================================================
// Filter & Search Parameters
// ============================================================================

/**
 * Issue filter parameters for /api/issues/filter endpoint
 * All parameters are optional
 */
export interface IssueFilterParams extends PageableRequest {
  projectId?: string;
  status?: IssueStatus;
  type?: IssueType;
  priority?: IssuePriority;
  assigneeId?: string;
  reporterId?: string;
}

/**
 * Issue search parameters for project-scoped search
 */
export interface IssueSearchParams extends PageableRequest {
  searchTerm: string;
  status?: IssueStatus;
  type?: IssueType;
  priority?: IssuePriority;
  assigneeId?: string;
}

/**
 * Overdue issues parameters
 */
export interface OverdueIssuesParams extends PageableRequest {
  asOfDate?: string; // LocalDate as ISO string (YYYY-MM-DD), defaults to today
}